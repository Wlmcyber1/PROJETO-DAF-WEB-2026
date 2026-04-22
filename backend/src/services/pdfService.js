import puppeteer from 'puppeteer';
import { generateEmailTemplate } from '../templates/emailTemplate';

export async function generatePDF(data) {
    const html = generateEmailTemplate(data);

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(html, { 
        waitUntil: 'networkidle0'
        });

    const pdfBuffer = await page.pdf ({
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20px',
            bottom: '20px',
        }
    });
    await browser.close();
    return pdfBuffer;
    }
