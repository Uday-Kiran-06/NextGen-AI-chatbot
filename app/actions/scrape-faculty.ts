'use server';

import axios from 'axios';
import * as cheerio from 'cheerio';
import { createAdminClient } from '@/lib/supabase/admin';

const DEPARTMENTS = [
  { name: 'Computer Science & Engineering', url: 'https://aliet.ac.in/departments/computer-science-engineering' },
  { name: 'Information Technology', url: 'https://aliet.ac.in/departments/information-technology' },
  { name: 'Electronics & Communication Engineering', url: 'https://aliet.ac.in/departments/electronics-communication-engineering' },
  { name: 'CSE (AI & ML)', url: 'https://aliet.ac.in/departments/cse-ai-ml' },
  { name: 'CSE (Data Science)', url: 'https://aliet.ac.in/departments/cse-data-science' },
  { name: 'Mechanical Engineering', url: 'https://aliet.ac.in/departments/mechanical-engineering' },
  { name: 'Civil Engineering', url: 'https://aliet.ac.in/departments/civil-engineering' },
  { name: 'Electrical & Electronics Engineering', url: 'https://aliet.ac.in/departments/electrical-electronics-engineering' },
  { name: 'Science & Humanities', url: 'https://aliet.ac.in/departments/science-humanities' },
  { name: 'MBA', url: 'https://aliet.ac.in/departments/master-of-business-administration' }
];

export async function scrapeFacultyData() {
  const supabase = createAdminClient();
  
  if (!supabase) {
    return { success: false, error: 'Database not configured' };
  }
  
  let totalScraped = 0;
  const errors = [];

  try {
    for (const dept of DEPARTMENTS) {
      console.log(`[Scrape] Processing ${dept.name}...`);
      try {
        const { data: html } = await axios.get(dept.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(html);

        // 1. Extract HOD
        const hodSection = $('.hod-profile, .hod-section, [class*="hod"]').first();
        if (hodSection.length) {
          const name = hodSection.find('h3, h4, .name').first().text().trim();
          const img = hodSection.find('img').attr('src');
          const fullImgUrl = img ? (img.startsWith('http') ? img : `https://aliet.ac.in${img}`) : null;

          if (name) {
            await supabase.from('faculty').upsert({
              name,
              department: dept.name,
              designation: 'HOD',
              image_url: fullImgUrl,
              is_hod: true
            }, { onConflict: 'name,department' });
            totalScraped++;
          }
        }

        // 2. Extract Faculty Table
        const tables = $('table.faculty-table, .faculty-table-scroll table, table').toArray();
        for (const table of tables) {
          const rows = $(table).find('tr').toArray();
          for (let i = 1; i < rows.length; i++) { // Skip header
            const row = rows[i];
            const cols = $(row).find('td');
            if (cols.length >= 2) {
              const name = $(cols[1]).text().trim();
              const designation = $(cols[2]).text().trim() || 'Assistant Professor';
              const qualification = $(cols[3]).text().trim();

              if (name && name.length > 3) {
                await supabase.from('faculty').upsert({
                  name,
                  department: dept.name,
                  designation,
                  qualification,
                  is_hod: designation.toLowerCase().includes('hod')
                }, { onConflict: 'name,department' });
                totalScraped++;
              }
            }
          }
        }

      } catch (err: any) {
        console.error(`Error scraping ${dept.name}:`, err.message);
        errors.push(`${dept.name}: ${err.message}`);
      }
      
      // Small delay to be polite
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return { success: true, count: totalScraped, errors };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
