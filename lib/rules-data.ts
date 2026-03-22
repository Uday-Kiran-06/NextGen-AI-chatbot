import { FACULTY_RULES } from './faculty-rules';

export interface Rule {
    keywords: string[];
    response: string;
}

export const RULES: Rule[] = [
    {
        keywords: ['hi', 'hii', 'hello', 'hey', 'greetings', 'yo', 'hi there'],
        response: "Hello! I'm NextGen AI. How can I assist you today? 🚀"
    },
    {
        keywords: ['who are you', 'your name', 'what are you', 'tell me about yourself'],
        response: "I am NextGen AI, a powerful chatbot designed to assist you with reasoning, coding, search, and image generation. 🤖"
    },
    {
        keywords: ['how are you', 'how s it going', 'how are things'],
        response: "I'm doing great and ready to help! What's on your mind? ✨"
    },
    {
        keywords: ['bye', 'goodbye', 'see ya', 'take care'],
        response: "Goodbye! Have a productive day! 👋"
    },
    {
        keywords: ['help', 'commands', 'what can you do', 'menu'],
        response: "I can help you with:\n- 🧠 **Complex Reasoning**: Using Pro models.\n- 💻 **Coding**: Writing and debugging scripts.\n- 🔍 **Web Search**: Real-time information access.\n- 🎨 **Image Generation**: Just use the `/image` command!\n- 📁 **File Analysis**: Upload PDFs or text files.\n- 🎓 **College Info**: I've indexed the ALIET website for you! Just ask about the college, faculty, or admissions."
    },
    {
        keywords: ['contact', 'address', 'phone', 'email', 'location', 'where is the college'],
        response: "📍 **Address**: ITI Road, ALC Campus, Polytechnic Post Office, Vijayawada - 520 008, Andhra Pradesh, India.\n\n📞 **Phone**: 0866-2498978 (Office), 0866-2476161 (Director)\n\n📧 **Email**: alietbza@gmail.com, info@aliet.ac.in"
    },
    {
        keywords: ['vision', 'mission', 'goal', 'objective'],
        response: "🌟 **Vision**: Integral formation based on academic excellence, spiritual growth, and value-based leadership.\n\n🎯 **Mission**: Providing rigorous academic foundation, equipping students with global skills, and moulding them as compassionate global citizens."
    },
    {
        keywords: ['principal', 'who is the principal', 'mahesh'],
        response: "🎓 **Principal**: Dr. O. Mahesh\n\nHe lead ALIET with a focus on 'Academic Excellence with Integral Formation'. Under his leadership, the college achieved NAAC A+ (3.33 CGPA) and NBA accreditation. 🏆\n\n![Dr. O. Mahesh](https://aliet.ac.in/storage/blocks/01KA7ZR9JFP4NTFJJ9WY63HNQ0.jpg)"
    },
    {
        keywords: ['departments', 'courses', 'branches', 'list of depts'],
        response: "📚 **Departments at ALIET**:\n1. Civil Engineering\n2. Computer Science & Engineering\n3. CSE (AI & ML)\n4. CSE (Data Science)\n5. Electrical & Electronics Engineering\n6. Electronics & Communication Engineering\n7. Information Technology\n8. Mechanical Engineering\n9. MBA\n10. Science & Humanities"
    },
    {
        keywords: ['admission', 'apply', 'join', 'seat'],
        response: "📝 For **Admissions**, you can contact the College Office at **0866-2498978**. The process is overseen by the Director and Principal to ensure academic merit and quality intake. 🤝"
    },
    {
        keywords: ['fee', 'payment', 'pay fees', 'portal', 'online payment', 'how to pay', 'alieterp', 'erp', 'fees', 'college fees', 'how to pay fees', 'payment link'],
        response: `💳 **Fee Payment at ALIET** 📚

To pay fees at Andhra Loyola Institute of Engineering & Technology (ALIET), you can follow these steps:

### Online Fee Payment:
1. Visit the **ALIET Fee Payment Portal**: 🔗 [alieterp.in](https://www.alieterp.in/)
2. Click on the **"Fee Payment"** tab.
3. Select the payment option (e.g., net banking, credit/debit card, UPI).
4. Enter the required details (e.g., student ID/Roll No, name, amount).
5. Confirm the payment and receive the receipt.

**Important:**
- Make sure to check the fee structure and payment deadlines on the ALIET website.
- Keep the receipt safe for future reference.
- In case of any issues, contact the accounts section or the college administration.

**Payment Modes:**
- Net banking
- Credit/debit card
- UPI

**Note:**
- The process may vary depending on the course and semester.
- Check with the accounts section for the most up-to-date information. 📝`
    },
    ...FACULTY_RULES
];
