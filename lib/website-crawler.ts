
import * as cheerio from 'cheerio';
import axios from 'axios';
import { addDocument } from './vector-store';

interface CrawlOptions {
    maxDepth?: number;
    maxPages?: number;
    urlFilter?: (url: string) => boolean;
}

interface CrawlerSection {
    title: string;
    paragraphs: string[];
    images: { url: string; alt: string }[];
}

export class WebsiteCrawler {
    private visitedUrls = new Set<string>();
    private queue: { url: string; depth: number }[] = [];
    private baseDomain: string = '';

    constructor(private options: CrawlOptions = {}) {}

    async crawl(startUrl: string) {
        this.baseDomain = new URL(startUrl).hostname;
        this.queue.push({ url: startUrl, depth: 0 });

        const maxPages = this.options.maxPages || 500;
        const maxDepth = this.options.maxDepth || 5;

        console.log(`Starting crawl of ${startUrl} (Max Pages: ${maxPages}, Max Depth: ${maxDepth})`);

        while (this.queue.length > 0 && this.visitedUrls.size < maxPages) {
            const { url, depth } = this.queue.shift()!;

            if (this.visitedUrls.has(url) || depth > maxDepth) continue;

            this.visitedUrls.add(url);
            console.log(`[${this.visitedUrls.size}/${maxPages}] Crawling: ${url} at depth ${depth}`);

            try {
                const { sections, links } = await this.processPage(url);
                
                for (const section of sections) {
                    if (section.content.length > 100) {
                        await addDocument(section.content, { 
                            url, 
                            source: 'website_crawl', 
                            crawled_at: new Date().toISOString(),
                            images: section.images
                        });
                        // Throttling: Wait 1 second between documents to avoid 429 errors
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
                
                console.log(`  -> Added ${sections.length} sections to vector store`);

                // Add new links to queue with prioritization
                for (const link of links) {
                    if (this.shouldCrawl(link)) {
                        // Prioritize department/faculty/hod links by adding them to the front of the queue
                        const lowerLink = link.toLowerCase();
                        const isPriorityLink = /department|faculty|hod|staff|academics|administration/.test(lowerLink);
                        
                        if (isPriorityLink) {
                            this.queue.unshift({ url: link, depth: depth + 1 });
                        } else {
                            this.queue.push({ url: link, depth: depth + 1 });
                        }
                    }
                }
            } catch (error: any) {
                console.error(`  -> Failed to crawl ${url}:`, error.message);
            }
        }

        console.log(`Crawl complete. Total pages indexed: ${this.visitedUrls.size}`);
    }

    public async processPage(url: string) {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
            timeout: 15000,
        });

        const html = response.data;
        const $ = cheerio.load(html);
        const pageTitle = $('title').text().replace(/\s+/g, ' ').trim() || 'ALIET';
        const links: string[] = [];

        // Extract Links
        $('a[href]').each((_, el) => {
            const href = $(el).attr('href');
            if (href) {
                try {
                    const absoluteUrl = new URL(href, url).href.split('#')[0];
                    links.push(absoluteUrl);
                } catch (e) {}
            }
        });

        // Remove noise once for the whole page
        $('script, style, nav, footer, iframe, ads, noscript, .sidebar, .menu, .modal, .header, .footer, .nav-container, .breadcrumbs').remove();

        const sections: { content: string; images: { url: string; alt: string }[] }[] = [];
        const seenContent = new Set<string>();

        // 1. Hidden Modal Extraction (Keep this as it's specialized for faculty lists)
        $('button[onclick*="openFacultyModal"]').each((_, el) => {
            const onclick = $(el).attr('onclick') || '';
            const match = onclick.match(/openFacultyModal\((.*)\)/);
            if (match && match[1]) {
                try {
                    const rawData = match[1].trim();
                    const name = (rawData.match(/name:\s*['"](.*?)['"]/) || [])[1] || '';
                    const designation = (rawData.match(/designation:\s*['"](.*?)['"]/) || [])[1] || '';
                    const qualification = (rawData.match(/qualification:\s*['"](.*?)['"]/) || [])[1] || '';
                    const bio = (rawData.match(/bio:\s*['"](.*?)['"]/) || [])[1] || '';
                    const avatar = (rawData.match(/avatar:\s*['"](.*?)['"]/) || [])[1] || '';

                    if (name || bio) {
                        const modalContent = `[${pageTitle}] Faculty Profile: ${name}\nDesignation: ${designation}\nQualification: ${qualification}\nBio: ${bio}`;
                        const images: { url: string; alt: string }[] = [];
                        
                        if (avatar && avatar.length > 5) {
                            try {
                                const absoluteAvatarUrl = new URL(avatar, url).href;
                                images.push({ url: absoluteAvatarUrl, alt: `${name} Profile Photo` });
                            } catch (e) {}
                        }

                        if (!seenContent.has(modalContent)) {
                            sections.push({ content: modalContent, images });
                            seenContent.add(modalContent);
                        }
                    }
                } catch (e) {}
            }
        });

        // 2. Semantic Selection based on Headers (Proximity Chunking)
        const $main = $('main').length > 0 ? $('main') : $('#content').length > 0 ? $('#content') : $('.content').length > 0 ? $('.content') : $('body');
        
        let currentSection: CrawlerSection | null = null;
        const elements = $main.find('h1, h2, h3, h4, h5, h6, p, img, li, .faculty-member, .card').toArray();

        for (const el of elements) {
            const $el = $(el);
            const tagName = el.tagName.toLowerCase();

            if (/^h[1-6]$/.test(tagName)) {
                const headerText = $el.text().replace(/\s+/g, ' ').trim();
                const isPersonnelHeader = /hod|head of department|principal|director|secretary|chairman|dean|professor|faculty/i.test(headerText);

                // New header starts a new section
                if (currentSection && currentSection.paragraphs.length > 0) {
                    const content = `[${pageTitle}] ${currentSection.title}\n${currentSection.paragraphs.join(' ')}`.trim();
                    if (content.length > 50 && !seenContent.has(content)) {
                        sections.push({ content, images: currentSection.images });
                        seenContent.add(content);
                    }
                }
                currentSection = {
                    title: headerText,
                    paragraphs: [],
                    images: []
                };
                
                if (isPersonnelHeader && headerText.length < 100) {
                    currentSection.paragraphs.push(`Role/Focus: ${headerText}`);
                }
            } else if (tagName === 'p' || tagName === 'li') {
                const text = $el.text().replace(/\s+/g, ' ').trim();
                if (text.length > 20) {
                    if (!currentSection) {
                        currentSection = { title: '', paragraphs: [], images: [] };
                    }
                    currentSection.paragraphs.push(text);
                }
            } else if (tagName === 'img') {
                const src = $el.attr('src');
                const alt = ($el.attr('alt') || $el.attr('title') || '').trim();
                
                if (src && this.isValidImage(src, alt)) {
                    try {
                        const absoluteImgUrl = new URL(src, url).href;
                        if (currentSection) {
                            currentSection.images.push({ url: absoluteImgUrl, alt: alt || 'Relevant Image' });
                        }
                    } catch (e) {}
                }
            } else if ($el.hasClass('faculty-member') || $el.hasClass('card')) {
                const text = $el.text().replace(/\s+/g, ' ').trim();
                const content = `[${pageTitle}] ${text}`;
                if (text.length > 100 && !seenContent.has(content)) {
                    const images = this.extractImagesFromElement($, $el, url);
                    sections.push({ content, images });
                    seenContent.add(content);
                }
            }
        }

        // Push final section
        if (currentSection && currentSection.paragraphs.length > 0) {
            const content = `[${pageTitle}] ${currentSection.title}\n${currentSection.paragraphs.join(' ')}`.trim();
            if (content.length > 50 && !seenContent.has(content)) {
                sections.push({ content, images: currentSection.images });
                seenContent.add(content);
            }
        }

        // 3. Fallback: If still nothing, handle as one block
        if (sections.length === 0) {
            const rawContent = $main.text().replace(/\s+/g, ' ').trim();
            if (rawContent.length > 50) {
                const content = `[${pageTitle}] ${rawContent}`;
                const images = this.extractImagesFromElement($, $main, url);
                sections.push({ content, images });
            }
        }

        // 4. Special Table Extraction for Faculty
        $('table').each((_, table) => {
            const $table = $(table);
            const headers: string[] = [];
            $table.find('th').each((_, th) => { headers.push($(th).text().trim().toLowerCase()); });
            
            if (headers.includes('name') || headers.includes('faculty') || headers.includes('designation')) {
                $table.find('tr').each((_, tr) => {
                    const $tr = $(tr);
                    const cells = $tr.find('td').toArray();
                    if (cells.length >= 2) {
                        const rowData = cells.map(c => $(c).text().trim()).join(' | ');
                        const content = `[${pageTitle}] Faculty Entry: ${rowData}`;
                        const images = this.extractImagesFromElement($, $tr, url);
                        if (!seenContent.has(content)) {
                            sections.push({ content, images });
                            seenContent.add(content);
                        }
                    }
                });
            }
        });

        return { sections, links };
    }

    private isValidImage(src: string, alt: string): boolean {
        if (!src || src.length > 500) return false;
        const lowerSrc = src.toLowerCase();
        const lowerAlt = alt.toLowerCase();
        const noise = ['logo', 'favicon', 'icon', 'banner', 'header', 'footer', 'bg', 'spacer', 'arrow', 'social'];
        const isNoise = noise.some(n => lowerSrc.includes(n) || lowerAlt.includes(n));
        const priority = ['principal', 'director', 'hod', 'faculty', 'member', 'secretary', 'chairman', 'dean'];
        const isPriority = priority.some(p => lowerAlt.includes(p));
        if (isNoise && !isPriority) return false;
        const isSlider = lowerSrc.includes('/storage/slides/') || lowerSrc.includes('/storage/banners/') || lowerSrc.includes('slider');
        if (isSlider && !isPriority) return false;
        return true;
    }

    public extractImagesFromElement($: cheerio.CheerioAPI, $el: cheerio.Cheerio<any>, baseUrl: string) {
        const images: { url: string; alt: string }[] = [];
        $el.find('img[src]').each((_, img) => {
            const src = $(img).attr('src');
            const alt = ($(img).attr('alt') || $(img).attr('title') || '').trim();
            if (src && this.isValidImage(src, alt)) {
                try {
                    const absoluteImgUrl = new URL(src, baseUrl).href;
                    images.push({ url: absoluteImgUrl, alt: alt || 'Relevant Image' });
                } catch (e) {}
            }
        });
        return images.slice(0, 10);
    }

    public shouldCrawl(url: string): boolean {
        try {
            const parsedUrl = new URL(url);
            if (parsedUrl.hostname !== this.baseDomain) return false;
            const ext = url.split('.').pop()?.toLowerCase();
            const blacklistedExts = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'zip', 'gz', 'mp4', 'mp3'];
            if (ext && blacklistedExts.includes(ext)) return false;
            return !this.visitedUrls.has(url);
        } catch (e) {
            return false;
        }
    }
}
