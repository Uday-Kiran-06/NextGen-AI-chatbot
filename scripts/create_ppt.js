const fs = require('fs');
const PptxGenJS = require('pptxgenjs');

async function generatePPT() {
    const pres = new PptxGenJS();

    // 1. Title Slide
    let slide1 = pres.addSlide();
    slide1.addText('NextGen Chatbot Project', { x: 1, y: 1, w: 8, h: 1, fontSize: 36, align: 'center', bold: true });
    slide1.addText('Project Documentation', { x: 1, y: 2.5, w: 8, h: 0.5, fontSize: 18, align: 'center', color: 'A0A0A0' });

    // 2. Project Structure
    let slide2 = pres.addSlide();
    slide2.addText('Project Structure', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 24, bold: true, color: '363636' });

    try {
        const structure = fs.readFileSync('project_structure.txt', 'utf8');
        // Truncate if too long or split into multiple slides if needed, but for now simple text box
        slide2.addText(structure, {
            x: 0.5, y: 1.2, w: 9, h: 4,
            fontSize: 10,
            fontFace: 'Courier New',
            color: '333333',
            lineSpacing: 12,
            autoFit: true
        });
    } catch (e) {
        slide2.addText('Error reading project structure file.', { x: 1, y: 2, fontSize: 14, color: 'FF0000' });
    }

    // 3. Screenshots Placeholder (Landing Page)
    let slide3 = pres.addSlide();
    slide3.addText('Application Output - Landing Page', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 24, bold: true, color: '363636' });

    slide3.addShape(pres.ShapeType.rect, { x: 1, y: 1.5, w: 8, h: 3.5, fill: { color: 'EEEEEE' }, line: { color: 'CCCCCC', width: 1 } });
    slide3.addText('PLACEHOLDER: Insert Landing Page Screenshot Here', { x: 1, y: 3, w: 8, h: 0.5, fontSize: 14, align: 'center', color: '666666' });
    slide3.addText('(Automated screenshot capture unavailable)', { x: 1, y: 3.5, w: 8, h: 0.5, fontSize: 10, align: 'center', color: '999999' });

    // 4. Screenshots Placeholder (Chat Interface)
    let slide4 = pres.addSlide();
    slide4.addText('Application Output - Chat Interface', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 24, bold: true, color: '363636' });

    slide4.addShape(pres.ShapeType.rect, { x: 1, y: 1.5, w: 8, h: 3.5, fill: { color: 'EEEEEE' }, line: { color: 'CCCCCC', width: 1 } });
    slide4.addText('PLACEHOLDER: Insert Chat Interface Screenshot Here', { x: 1, y: 3, w: 8, h: 0.5, fontSize: 14, align: 'center', color: '666666' });
    slide4.addText('(Automated screenshot capture unavailable)', { x: 1, y: 3.5, w: 8, h: 0.5, fontSize: 10, align: 'center', color: '999999' });

    // Save
    try {
        await pres.writeFile({ fileName: 'NextGen_Chatbot_Presentation.pptx' });
        console.log('Presentation created successfully: NextGen_Chatbot_Presentation.pptx');
    } catch (err) {
        console.error('Error saving presentation:', err);
    }
}

generatePPT();
