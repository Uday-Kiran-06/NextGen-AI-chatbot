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
        response: "I can help you with:\n- 🧠 **Complex Reasoning**: Using Pro models.\n- 💻 **Coding**: Writing and debugging scripts.\n- 🔍 **Web Search**: Real-time information access.\n- 🎨 **Image Generation**: Just use the `/image` command!\n- 📁 **File Analysis**: Upload PDFs or text files."
    },

    // --- Specific College Roles ---
    {
        keywords: ['principal', 'mahesh', 'dr o mahesh', 'who is principal'],
        response: `**Dr. O. Mahesh**\n![Principal](https://aliet.ac.in/storage/blocks/01KA7ZR9JFP4NTFJJ9WY63HNQ0.jpg)\n_*Principal, Andhra Loyola Institute of Engineering & Technology*_`
    },
    {
        keywords: ['director', 'secretary', 'joji reddy', 'fr joji reddy', 'who is director', 'who is secretary'],
        response: `**Rev. Fr. Dr. B. Joji Reddy S.J**\n![Director](https://aliet.ac.in/storage/blocks/01K8D7DZ0AZSD7TWV75WK07MM0.jpg)\n_*Secretary & Director, Andhra Loyola Institute of Engineering & Technology*_`
    },

    // --- Specific Faculty Profiles ---
    {
        keywords: ["dr l kanya kumari", "kanya kumari", "kumari", "dr. l. kanya kumari"],
        response: `**Dr. L. Kanya Kumari**
_Associate Professor & HOD, Computer Science Engineering_
- Qualification: Ph.D`
    },
    {
        keywords: ["rama krishna", "krishna", "dr k siva rama krishna", "dr. k. siva rama krishna"],
        response: `**Dr.K.Siva Rama Krishna**
_Associate Professor, Computer Science Engineering_
- Qualification: Ph.D
![Dr.K.Siva Rama Krishna](https://aliet.ac.in/storage/120/01K8WVMA7V90D4T9SA49ZF2EQE.png)`
    },
    {
        keywords: ["sireesha", "dr k sireesha", "k sireesha", "dr. k. sireesha"],
        response: `**Dr. K. Sireesha**
_Associate Professor, Computer Science Engineering_
- Qualification: Ph.D`
    },
    {
        keywords: ["sandeep", "mr m samuel sandeep", "samuel sandeep", "mr. m. samuel sandeep"],
        response: `**Mr. M. Samuel Sandeep**
_Associate Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["dr k venkateswara rao", "dr. k. venkateswara rao", "venkateswara rao", "rao"],
        response: `**Dr. K. Venkateswara Rao**
_Assistant Professor, Computer Science Engineering_
- Qualification: Ph.D`
    },
    {
        keywords: ["manoj", "mr v v r manoj", "mr. v v r manoj", "r manoj"],
        response: `**Mr. V V R Manoj**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["karuna manjusha", "mrs. y karuna manjusha", "mrs y karuna manjusha", "manjusha"],
        response: `**Mrs. Y Karuna Manjusha**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mrs ch pavani", "ch pavani", "pavani", "mrs. ch pavani"],
        response: `**Mrs. Ch Pavani**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["k neeharika", "mrs k neeharika", "neeharika"],
        response: `**Mrs K Neeharika**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mrs p nancy anurag", "nancy anurag", "anurag"],
        response: `**Mrs P Nancy Anurag**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mr k satish", "k satish", "satish"],
        response: `**Mr K Satish**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["k rajeswari", "rajeswari", "mrs k rajeswari"],
        response: `**Mrs K Rajeswari**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mr k kishore kumar", "kishore kumar", "kumar"],
        response: `**Mr K Kishore Kumar**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mrs k sravanthi", "k sravanthi", "sravanthi"],
        response: `**Mrs. K. Sravanthi**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mary lavanya", "lavanya", "mrs a mary lavanya"],
        response: `**Mrs A Mary Lavanya**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["manaswini", "mrs n v l manaswini", "l manaswini"],
        response: `**Mrs N V L Manaswini**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mrs b alekhya", "alekhya", "b alekhya"],
        response: `**Mrs B Alekhya**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["usha", "naga usha", "mrs m naga usha"],
        response: `**Mrs M Naga Usha**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["pushpavalli", "mrs k pushpavalli", "k pushpavalli"],
        response: `**Mrs K Pushpavalli**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["iswarya gold", "gold", "ms a iswarya gold"],
        response: `**Ms A Iswarya Gold**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["lakshmi", "rama lakshmi", "mrs v rama lakshmi"],
        response: `**Mrs V Rama Lakshmi**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["meher babu", "babu", "dr ch meher babu"],
        response: `**Dr Ch Meher Babu**
_Assistant Professor, Computer Science Engineering_
- Qualification: Ph.D`
    },
    {
        keywords: ["pramodini", "b pramodini", "mrs y b pramodini"],
        response: `**Mrs Y B Pramodini**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["rao", "basaveswara rao", "mr b n v basaveswara rao"],
        response: `**Mr B N V Basaveswara Rao**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["havila", "mrs m havila", "m havila"],
        response: `**Mrs M Havila**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["vijaya varma", "varma", "mr n naga vijaya varma"],
        response: `**Mr N Naga Vijaya Varma**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["prakasa rao", "dr y prakasa rao", "rao"],
        response: `**Dr Y Prakasa Rao**
_Assistant Professor, Computer Science Engineering_
- Qualification: Ph.D`
    },
    {
        keywords: ["sai", "mrs n rohini krishna sai", "krishna sai"],
        response: `**Mrs N Rohini Krishna Sai**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["srinivasa rao", "rao", "mr k srinivasa rao"],
        response: `**Mr K Srinivasa Rao**
_Assistant Professor, Computer Science Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["roy", "sumender roy", "dr m sumender roy"],
        response: `**Dr M Sumender Roy**
_Associate Professor, Computer Science Engineering_
- Qualification: Ph.D`
    },
    {
        keywords: ["mr. v. vidya sagar", "sagar", "mr v vidya sagar", "vidya sagar"],
        response: `**Mr. V. Vidya Sagar**
_Associate Professor & HOD, Information Technology_
- Qualification: M.Tech., (Ph.D)`
    },
    {
        keywords: ["mrs m kaladevi", "mrs. m. kaladevi", "kaladevi", "m kaladevi"],
        response: `**Mrs. M. Kaladevi**
_Assistant Professor, Information Technology_
- Qualification: M.Tech
![Mrs. M. Kaladevi](https://aliet.ac.in/storage/336/01K99FWTWW1BEZVH0QEYD5Z77S.jpg)`
    },
    {
        keywords: ["mr. t. kiran", "mr t kiran", "kiran", "t kiran"],
        response: `**Mr. T.Kiran**
_Assistant Professor, Information Technology_
- Qualification: M.Tech
![Mr. T.Kiran](https://aliet.ac.in/storage/323/01K94TP2WAPNW7N7BG9DCD71BK.jpg)`
    },
    {
        keywords: ["m suneela", "mrs m suneela", "mrs. m. suneela", "suneela"],
        response: `**Mrs. M. Suneela**
_Assistant Professor, Information Technology_
- Qualification: M.Tech
![Mrs. M. Suneela](https://aliet.ac.in/storage/337/01K99FYVKKSBPCBW3CPQCVJYHZ.jpg)`
    },
    {
        keywords: ["rekha", "kanthi rekha", "mrs. m. kanthi rekha", "mrs m kanthi rekha"],
        response: `**Mrs. M. Kanthi Rekha**
_Assistant Professor, Information Technology_
- Qualification: M.Tech
![Mrs. M. Kanthi Rekha](https://aliet.ac.in/storage/338/01K99FZFZW2T55VXMD9GBJBP7G.jpg)`
    },
    {
        keywords: ["sudha rani", "ms. g. sudha rani", "rani", "ms g sudha rani"],
        response: `**Ms. G. Sudha Rani**
_Assistant Professor, Information Technology_
- Qualification: M.Tech
![Ms. G. Sudha Rani](https://aliet.ac.in/storage/324/01K94TVYM74NMAGWKHFXHJ43D6.jpg)`
    },
    {
        keywords: ["k yaswanth", "mr k yaswanth", "yaswanth", "mr. k. yaswanth"],
        response: `**Mr. K. Yaswanth**
_Assistant Professor, Information Technology_
- Qualification: M.Tech
![Mr. K. Yaswanth](https://aliet.ac.in/storage/325/01K94V06BG4G7F0RARR5GWG4V0.jpg)`
    },
    {
        keywords: ["dr. m. chinna rao", "dr m chinna rao", "rao", "chinna rao"],
        response: `**Dr. M. Chinna Rao**
_Associate Professor, Information Technology_
- Qualification: Ph.D`
    },
    {
        keywords: ["dr p sudheer", "dr. p. sudheer", "p sudheer", "sudheer"],
        response: `**Dr. P. Sudheer**
_Assistant Professor, Information Technology_
- Qualification: Ph.D
![Dr. P. Sudheer](https://aliet.ac.in/storage/326/01K94V42X9T1463G2P0JCEN0F0.jpg)`
    },
    {
        keywords: ["dr.k.prasanthi jasmine", "jasmine", "drkprasanthi jasmine"],
        response: `**Dr.K.PRASANTHI JASMINE**
_PROFESSOR, Electronics Communication Engineering_
- Qualification: Ph.D
![Dr.K.PRASANTHI JASMINE](https://aliet.ac.in/storage/471/01KADH1XVR4QESD8MJZWAWHWTF.png)`
    },
    {
        keywords: ["rama krishna", "krishna", "mr.mullapdi rama krishna", "mrmullapdi rama krishna"],
        response: `**Mr.MULLAPDI RAMA KRISHNA**
_ASSOCIATE PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mr.MULLAPDI RAMA KRISHNA](https://aliet.ac.in/storage/529/01KATRGRM8KKCGK40K896WMAB7.jpg)`
    },
    {
        keywords: ["narayana thalluri", "thalluri", "dr. lakshmi narayana thalluri", "dr lakshmi narayana thalluri"],
        response: `**Dr. LAKSHMI NARAYANA THALLURI**
_ASSOCIATE PROFESSOR & HOD, Electronics Communication Engineering_
- Qualification: Ph.D
![Dr. LAKSHMI NARAYANA THALLURI](https://aliet.ac.in/storage/732/01KC497DZQDDRF80BS88QJKP7X.jpg)`
    },
    {
        keywords: ["drsmallikharjuna rao", "rao", "dr.s.mallikharjuna rao"],
        response: `**Dr.S.MALLIKHARJUNA RAO**
_ASSOCIATE PROFESSOR, Electronics Communication Engineering_
- Qualification: Ph.D
![Dr.S.MALLIKHARJUNA RAO](https://aliet.ac.in/storage/523/01KANJ9PWJM98A2ATN9QJKHV6E.jpg)`
    },
    {
        keywords: ["drkmariya priyadarshini", "priyadarshini", "dr.k.mariya priyadarshini"],
        response: `**Dr.K.MARIYA PRIYADARSHINI**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: Ph.D
![Dr.K.MARIYA PRIYADARSHINI](https://aliet.ac.in/storage/517/01KANF1WFX15064KJVKBJAH0EJ.png)`
    },
    {
        keywords: ["mrsbsanthi kiran", "mrs.b.santhi kiran", "kiran"],
        response: `**Mrs.B.SANTHI KIRAN**
_ASSOCIATE PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mrs.B.SANTHI KIRAN](https://aliet.ac.in/storage/518/01KANFARNXD8RT8CGDGYMJCVJQ.jpg)`
    },
    {
        keywords: ["babu", "mrpbose babu", "mr.p.bose babu"],
        response: `**Mr.P.BOSE BABU**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mr.P.BOSE BABU](https://aliet.ac.in/storage/527/01KAT832V3DW7Y641ET87WBAJQ.jpg)`
    },
    {
        keywords: ["mrgroopa krishna chandra", "mr.g.roopa krishna chandra", "chandra", "krishna chandra"],
        response: `**Mr.G.ROOPA KRISHNA CHANDRA**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mr.G.ROOPA KRISHNA CHANDRA](https://aliet.ac.in/storage/526/01KAT7W4HY4RTMC6A22MCATZ0W.jpg)`
    },
    {
        keywords: ["mr.gorapudi ravi", "mrgorapudi ravi", "ravi"],
        response: `**Mr.GORAPUDI RAVI**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mr.GORAPUDI RAVI](https://aliet.ac.in/storage/524/01KANJGQKDWACSSX002JCJV6Y3.jpg)`
    },
    {
        keywords: ["mrypavan kumar", "kumar", "mr.y.pavan kumar"],
        response: `**Mr.Y.PAVAN KUMAR**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mrkanakala appala raju", "mr.kanakala appala raju", "raju", "appala raju"],
        response: `**Mr.KANAKALA APPALA RAJU**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mr.gayala vijay kumar", "kumar", "mrgayala vijay kumar", "vijay kumar"],
        response: `**Mr.GAYALA VIJAY KUMAR**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mr.GAYALA VIJAY KUMAR](https://aliet.ac.in/storage/521/01KANHSDW3STYXSZPJJME8XDWK.jpg)`
    },
    {
        keywords: ["rama krishna", "krishna", "mr.merugamalli rama krishna", "mrmerugamalli rama krishna"],
        response: `**Mr.MERUGAMALLI RAMA KRISHNA**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mr.MERUGAMALLI RAMA KRISHNA](https://aliet.ac.in/storage/519/01KANFP0NTKQSJFJCDJ17JTDCT.jpg)`
    },
    {
        keywords: ["mrkosuru srinivasa rao", "srinivasa rao", "mr.kosuru srinivasa rao", "rao"],
        response: `**Mr.KOSURU SRINIVASA RAO**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mr.KOSURU SRINIVASA RAO](https://aliet.ac.in/storage/520/01KANFVC3BFMF43NB2KAK48PM0.jpg)`
    },
    {
        keywords: ["mr.abdul azeem", "azeem", "mrabdul azeem"],
        response: `**Mr.ABDUL AZEEM**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["baig mohammad", "mrmohammad baig mohammad", "mr.mohammad baig mohammad", "mohammad"],
        response: `**Mr.MOHAMMAD BAIG MOHAMMAD**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mr.MOHAMMAD BAIG MOHAMMAD](https://aliet.ac.in/storage/528/01KATR9EDNSHPH7Q2Y21FKHQAP.jpg)`
    },
    {
        keywords: ["mr.m.ravi kumar", "kumar", "mrmravi kumar"],
        response: `**Mr.M.RAVI KUMAR**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mr.M.RAVI KUMAR](https://aliet.ac.in/storage/525/01KANJVFRH8WBFKEPKJ9XM5SYD.jpg)`
    },
    {
        keywords: ["mrstmanogna", "mrs.t.manogna"],
        response: `**Mrs.T.MANOGNA**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech
![Mrs.T.MANOGNA](https://aliet.ac.in/storage/516/01KANEKAR96MF9ATETK428PE7S.jpg)`
    },
    {
        keywords: ["mrnbujji babu", "babu", "mr.n.bujji babu"],
        response: `**Mr.N.BUJJI BABU**
_ASSISTANT PROFESSOR, Electronics Communication Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["dr. g. naveen kumar", "kumar", "naveen kumar", "dr g naveen kumar"],
        response: `**Dr. G. Naveen Kumar**
_Professor & HOD, Electrical Electronics Engineering_
- Qualification: Ph.D
![Dr. G. Naveen Kumar](https://aliet.ac.in/storage/177/01K8Z0B5EYQQPY7Q89P3KG4X90.jpg)`
    },
    {
        keywords: ["ajay kumar", "dr m ajay kumar", "kumar", "dr. m. ajay kumar"],
        response: `**Dr. M. Ajay Kumar**
_Associate Professor, Electrical Electronics Engineering_
- Qualification: Ph.D
![Dr. M. Ajay Kumar](https://aliet.ac.in/storage/178/01K8Z30ZXATGDKZSEWNQ06X3WB.jpg)`
    },
    {
        keywords: ["dr. v. anantha lakshmi", "dr v anantha lakshmi", "lakshmi", "anantha lakshmi"],
        response: `**Dr. V. Anantha Lakshmi**
_Assistant Professor, Electrical Electronics Engineering_
- Qualification: Ph.D
![Dr. V. Anantha Lakshmi](https://aliet.ac.in/storage/360/01K9CB95GXHER537GW0P0HWDVQ.jpg)`
    },
    {
        keywords: ["gantaiah swamy", "swamy", "dr. g. gantaiah swamy", "dr g gantaiah swamy"],
        response: `**Dr. G. Gantaiah Swamy**
_Assistant Professor, Electrical Electronics Engineering_
- Qualification: Ph.D
![Dr. G. Gantaiah Swamy](https://aliet.ac.in/storage/359/01K9CB74RHG2JCZXBM0PZBZKXC.jpg)`
    },
    {
        keywords: ["l karunakar", "karunakar", "mr. l. karunakar", "mr l karunakar"],
        response: `**Mr. L. Karunakar**
_Assistant Professor, Electrical Electronics Engineering_
- Qualification: M.Tech
![Mr. L. Karunakar](https://aliet.ac.in/storage/356/01K9C7JCZVAM83FM5DVWT4FWJY.jpg)`
    },
    {
        keywords: ["mr t krishna mohan", "mohan", "krishna mohan", "mr. t. krishna mohan"],
        response: `**Mr. T. Krishna Mohan**
_Assistant Professor, Electrical Electronics Engineering_
- Qualification: M.Tech
![Mr. T. Krishna Mohan](https://aliet.ac.in/storage/358/01K9C7KQWMVP5E8DSH6WX67DBH.jpg)`
    },
    {
        keywords: ["rama krishna", "mr m rama krishna", "krishna", "mr. m. rama krishna"],
        response: `**Mr. M. Rama Krishna**
_Assistant Professor, Electrical Electronics Engineering_
- Qualification: M.Tech
![Mr. M. Rama Krishna](https://aliet.ac.in/storage/352/01K9C52JQA1SKR9WKMYF23Z7HR.jpg)`
    },
    {
        keywords: ["mr. v. brahmeswara rao", "mr v brahmeswara rao", "brahmeswara rao", "rao"],
        response: `**Mr. V. Brahmeswara Rao**
_Assistant Professor, Electrical Electronics Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["ms b sruthi", "b sruthi", "sruthi", "ms. b. sruthi"],
        response: `**Ms. B. Sruthi**
_Assistant Professor, Electrical Electronics Engineering_
- Qualification: M.Tech
![Ms. B. Sruthi](https://aliet.ac.in/storage/357/01K9C7K3S0Z822BXE4ZVPST4N3.jpg)`
    },
    {
        keywords: ["chandhni srilakshmi", "srilakshmi", "ms. a. chandhni srilakshmi", "ms a chandhni srilakshmi"],
        response: `**Ms. A. Chandhni Srilakshmi**
_Assistant Professor, Electrical Electronics Engineering_
- Qualification: M.Tech
![Ms. A. Chandhni Srilakshmi](https://aliet.ac.in/storage/353/01K9C53SRW9HFGFV10X1QZ6BX4.jpg)`
    },
    {
        keywords: ["mr. nagaraju chanumolu", "mr nagaraju chanumolu", "chanumolu", "nagaraju chanumolu"],
        response: `**Mr. Nagaraju Chanumolu**
_Assoc.Prof. & HOD, Civil Engineering_
- Qualification: M.Tech
![Mr. Nagaraju Chanumolu](https://aliet.ac.in/storage/219/01K93YFF645KVMNQ4GZJPP1AEW.jpg)`
    },
    {
        keywords: ["kiran kumar", "kumar", "mr k kiran kumar", "mr. k. kiran kumar"],
        response: `**Mr. K. Kiran Kumar**
_Asst.Prof, Civil Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mr k mallikarjuna rao", "rao", "mr. k. mallikarjuna rao", "mallikarjuna rao"],
        response: `**Mr. K. Mallikarjuna Rao**
_Asst.Prof, Civil Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mr n abhilash", "n abhilash", "abhilash", "mr. n. abhilash"],
        response: `**Mr. N. Abhilash**
_Asst.Prof, Civil Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["v suryateja", "suryateja", "mr. v. suryateja", "mr v suryateja"],
        response: `**Mr. V. Suryateja**
_Asst.Prof, Civil Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mrs. a. tejaswi", "mrs a tejaswi", "a tejaswi", "tejaswi"],
        response: `**Mrs. A. Tejaswi**
_Asst.Prof, Civil Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["padmaja", "mrs. v. swathi padmaja", "mrs v swathi padmaja", "swathi padmaja"],
        response: `**Mrs. V. Swathi Padmaja**
_Asst.Prof, Civil Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["ms. g. mahitha", "mahitha", "g mahitha", "ms g mahitha"],
        response: `**Ms. G. Mahitha**
_Asst.Prof, Civil Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["dr.o.mahesh", "dromahesh"],
        response: `**Dr.O.Mahesh**
_Professor, Mechanical Engineering_
- Qualification: Ph.D`
    },
    {
        keywords: ["rani", "dr.m.geeta rani", "drmgeeta rani"],
        response: `**Dr.M.Geeta Rani**
_Associate Professor, Mechanical Engineering_
- Qualification: Ph.D`
    },
    {
        keywords: ["kumar", "dr.b.sudheer kumar", "drbsudheer kumar"],
        response: `**Dr.B.Sudheer Kumar**
_Associate Professor, Mechanical Engineering_
- Qualification: Ph.D`
    },
    {
        keywords: ["mrmsudhakar", "mr.m.sudhakar"],
        response: `**Mr.M.Sudhakar**
_Associate Professor, Mechanical Engineering_
- Qualification: ME`
    },
    {
        keywords: ["rao", "mr.ch.ranga rao", "mrchranga rao"],
        response: `**Mr.Ch.Ranga Rao**
_Associate Professor, Mechanical Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mrs.b.susmitha", "mrsbsusmitha"],
        response: `**Mrs.B.Susmitha**
_Assistant Professor, Mechanical Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mr.m.srinivasa reddy", "mrmsrinivasa reddy", "reddy"],
        response: `**Mr.M.Srinivasa Reddy**
_Assistant Professor, Mechanical Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["mrmteja swarup", "swarup", "mr.m.teja swarup"],
        response: `**Mr.M.Teja Swarup**
_Assistant Professor, Mechanical Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["drggsrinivasu", "dr.g.g.srinivasu"],
        response: `**Dr.G.G.Srinivasu**
_Assistant Professor, Mechanical Engineering_
- Qualification: Ph.D`
    },
    {
        keywords: ["mr.e.durgesh", "mredurgesh"],
        response: `**Mr.E.Durgesh**
_Assistant Professor, Mechanical Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["dr t subba reddy", "subba reddy", "dr. t. subba reddy", "reddy"],
        response: `**Dr. T. Subba Reddy**
_Assistant Professor, Mechanical Engineering_
- Qualification: Ph.D
![Dr. T. Subba Reddy](https://aliet.ac.in/storage/8/01K8W79709NQTGPYBFYNE1CZ5W.jpg)`
    },
    {
        keywords: ["kiran", "mrkuday kiran", "mr.k.uday kiran"],
        response: `**Mr.K.Uday Kiran**
_Faculty Member, Mechanical Engineering_
- Qualification: M.Tech`
    },
    {
        keywords: ["dr. m. vijay kumar", "kumar", "dr m vijay kumar", "vijay kumar"],
        response: `**Dr. M. Vijay Kumar**
_Professor & HOD, Master Of Business Administration_
- Qualification: Ph.D
![Dr. M. Vijay Kumar](https://aliet.ac.in/storage/345/01K99PZB38NSA9EXHHRNNH4FGH.jpg)`
    },
    {
        keywords: ["razia begum", "sk razia begum", "sk. razia begum", "begum"],
        response: `**Sk. Razia Begum**
_Assistant Professor, Master Of Business Administration_
- Qualification: MBA,M.Com
![Sk. Razia Begum](https://aliet.ac.in/storage/343/01K99PY7BSR2Y9C0ZCN0SAZF95.jpg)`
    },
    {
        keywords: ["madhavi", "dr.g. lalitha madhavi", "drg lalitha madhavi", "lalitha madhavi"],
        response: `**Dr.G. Lalitha Madhavi**
_Assistant Professor, Master Of Business Administration_
- Qualification: Ph.D
![Dr.G. Lalitha Madhavi](https://aliet.ac.in/storage/344/01K99PYMYDRRKN1JMVZT66BGNE.jpg)`
    },
    {
        keywords: ["k sattibabu", "sattibabu", "dr k sattibabu", "dr. k. sattibabu"],
        response: `**Dr. K. Sattibabu**
_Associate Professor, Master Of Business Administration_
- Qualification: M.Com.,UGC NET.,MBAPh.D
![Dr. K. Sattibabu](https://aliet.ac.in/storage/533/01KAX8YYXKN6EJE3EDQ46TH6ND.jpg)`
    },
    {
        keywords: ["drb shanti", "shanti", "dr.b. shanti"],
        response: `**Dr.B. Shanti**
_Assistant Professor, Master Of Business Administration_
- Qualification: Ph.D
![Dr.B. Shanti](https://aliet.ac.in/storage/361/01K9CE9E4RF96WGT573SHZSH3N.jpg)`
    },
    {
        keywords: ["indira", "dr. m. indira", "dr m indira", "m indira"],
        response: `**Dr. M. Indira**
_Assistant Professor, Master Of Business Administration_
- Qualification: Ph.D
![Dr. M. Indira](https://aliet.ac.in/storage/347/01K99QVP5EM564WS1ES5ASJXGP.jpg)`
    },
    {
        keywords: ["dr.y. sudhakar", "dry sudhakar", "sudhakar"],
        response: `**Dr.Y. Sudhakar**
_Assistant Professor & HOD, Science Humanities_
- Qualification: Ph.D
![Dr.Y. Sudhakar](https://aliet.ac.in/storage/429/01K9VKA818X3JHJR84B2P10TBV.jpg)`
    },
    {
        keywords: ["ms s. p. v. n. d. sumalatha", "d sumalatha", "ms s p v n d sumalatha", "sumalatha"],
        response: `**Ms S. P. V. N. D. Sumalatha**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc,M.Phil,(Ph.D)`
    },
    {
        keywords: ["dr.v. v. prabhakar rao", "prabhakar rao", "rao", "drv v prabhakar rao"],
        response: `**Dr.V. V. Prabhakar Rao**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc, Ph.D
![Dr.V. V. Prabhakar Rao](https://aliet.ac.in/storage/368/01K9S3F12XFDMBXWHES8CAJK1S.jpg)`
    },
    {
        keywords: ["sudha rani", "drp sudha rani", "rani", "dr.p. sudha rani"],
        response: `**Dr.P. Sudha Rani**
_Assistant Professor, Science Humanities_
- Qualification: M.B.A, Ph.d
![Dr.P. Sudha Rani](https://aliet.ac.in/storage/339/01K99J536EP7QSWQAB14173FAR.jpg)`
    },
    {
        keywords: ["drn dyvakrupa", "dr.n. dyvakrupa", "dyvakrupa"],
        response: `**Dr.N. DyvaKrupa**
_Assistant Professor, Science Humanities_
- Qualification: M.A, Ph.D
![Dr.N. DyvaKrupa](https://aliet.ac.in/storage/370/01K9S3TBAR0Y37H61GTGS747TJ.jpg)`
    },
    {
        keywords: ["mr y.rajesh", "mr yrajesh", "yrajesh"],
        response: `**Mr Y.Rajesh**
_Physical Director, Science Humanities_
- Qualification: M.P.Ed`
    },
    {
        keywords: ["mr b.ravi shankar", "shankar", "bravi shankar", "mr bravi shankar"],
        response: `**Mr B.Ravi Shankar**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc,(Ph.D)`
    },
    {
        keywords: ["psugandha kumar", "mr p.sugandha kumar", "mr psugandha kumar", "kumar"],
        response: `**Mr P.Sugandha kumar**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc, Ph.D
![Mr P.Sugandha kumar](https://aliet.ac.in/storage/367/01K9S3CSETCHNSSB7PBTGVT170.jpg)`
    },
    {
        keywords: ["ms b.sarath kumari", "ms bsarath kumari", "bsarath kumari", "kumari"],
        response: `**Ms B.Sarath Kumari**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc, B.Ed,(Ph.D)`
    },
    {
        keywords: ["mrs k.swathi kiran", "mrs kswathi kiran", "kiran", "kswathi kiran"],
        response: `**Mrs K.Swathi Kiran**
_Assistant Professor, Science Humanities_
- Qualification: M.L.I.SC
![Mrs K.Swathi Kiran](https://aliet.ac.in/storage/427/01K9VJW8MTTD4X6K35PGR02BZP.jpg)`
    },
    {
        keywords: ["candy d'cunha", "drsr candy d'cunha", "d'cunha", "dr.sr. candy d'cunha"],
        response: `**Dr.Sr. Candy D'Cunha**
_Associate Professor, Science Humanities_
- Qualification: M.A, M.Phil,Ph.D(DLitt)`
    },
    {
        keywords: ["dr. ch.vijaya lakshmi", "chvijaya lakshmi", "lakshmi", "dr chvijaya lakshmi"],
        response: `**Dr. Ch.Vijaya Lakshmi**
_Assistant Professor, Science Humanities_
- Qualification: M.B.A, Ph.d
![Dr. Ch.Vijaya Lakshmi](https://aliet.ac.in/storage/340/01K99JYHHY9M3J2CVX5A142BT1.jpg)`
    },
    {
        keywords: ["e kalavathi", "kalavathi", "mrs e kalavathi", "mrs e. kalavathi"],
        response: `**Mrs E. kalavathi**
_Assistant Professor, Science Humanities_
- Qualification: M.A
![Mrs E. kalavathi](https://aliet.ac.in/storage/366/01K9S3B4ZCR6Y4AP8DRVX0FBMC.jpg)`
    },
    {
        keywords: ["mrs m.archana", "marchana", "mrs marchana"],
        response: `**Mrs M.Archana**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc, B.Ed`
    },
    {
        keywords: ["ms k.rajya lakshmi", "krajya lakshmi", "ms krajya lakshmi", "lakshmi"],
        response: `**Ms K.Rajya Lakshmi**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc
![Ms K.Rajya Lakshmi](https://aliet.ac.in/storage/371/01K9S3WMHD1GE1XHCHZT9KW42A.jpg)`
    },
    {
        keywords: ["dr tkalpana", "tkalpana", "dr t.kalpana"],
        response: `**Dr T.Kalpana**
_Assistant Professor, Science Humanities_
- Qualification: Ph.D
![Dr T.Kalpana](https://aliet.ac.in/storage/437/01K9VM8S5ZGWJV48YTMMYM4BE6.jpg)`
    },
    {
        keywords: ["mrs ssaritha", "ssaritha", "mrs s.saritha"],
        response: `**Mrs S.Saritha**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc
![Mrs S.Saritha](https://aliet.ac.in/storage/372/01K9S436KKFKHBE8HVJ9BZ53XR.jpg)`
    },
    {
        keywords: ["mrs b.sailaja", "bsailaja", "mrs bsailaja"],
        response: `**Mrs B.Sailaja**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc`
    },
    {
        keywords: ["mr a.kalyan kumar", "mr akalyan kumar", "kumar", "akalyan kumar"],
        response: `**Mr A.Kalyan Kumar**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc
![Mr A.Kalyan Kumar](https://aliet.ac.in/storage/430/01K9VKBT4F6BTA8VWF6FYNXB16.jpg)`
    },
    {
        keywords: ["mr t.sujith", "tsujith", "mr tsujith"],
        response: `**Mr T.Sujith**
_Assistant Professor, Science Humanities_
- Qualification: M.A
![Mr T.Sujith](https://aliet.ac.in/storage/373/01K9S460AT78JPR33YHFFEEP2Z.jpg)`
    },
    {
        keywords: ["ms k.leela prasanna", "prasanna", "ms kleela prasanna", "kleela prasanna"],
        response: `**Ms K.Leela Prasanna**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc
![Ms K.Leela Prasanna](https://aliet.ac.in/storage/341/01K99KVQ7R0W0C5R8M8GSZ86JP.jpg)`
    },
    {
        keywords: ["lakshmi", "kvasantha lakshmi", "ms kvasantha lakshmi", "ms k.vasantha lakshmi"],
        response: `**Ms K.Vasantha Lakshmi**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc
![Ms K.Vasantha Lakshmi](https://aliet.ac.in/storage/342/01K99M5THK6WQC5Y2DM75JC1WT.jpg)`
    },
    {
        keywords: ["satvika", "ms b.tripurasri satvika", "ms btripurasri satvika", "btripurasri satvika"],
        response: `**MS B.TripuraSri Satvika**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc
![MS B.TripuraSri Satvika](https://aliet.ac.in/storage/376/01K9S4JYC25WVP74WV3KMHXZC3.jpg)`
    },
    {
        keywords: ["ms parimala jyothi", "jyothi", "parimala jyothi"],
        response: `**Ms Parimala Jyothi**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc
![Ms Parimala Jyothi](https://aliet.ac.in/storage/374/01K9S47GV6JPVVBY69T2B02MRX.jpg)`
    },
    {
        keywords: ["lakshmi", "mrs m.vijaya lakshmi", "mrs mvijaya lakshmi", "mvijaya lakshmi"],
        response: `**Mrs M.Vijaya Lakshmi**
_Assistant Professor, Science Humanities_
- Qualification: M.Sc
![Mrs M.Vijaya Lakshmi](https://aliet.ac.in/storage/375/01K9S4AX5T6MAQSBKJFES66KQE.jpg)`
    },
    {
        keywords: ["ycashok kumar", "mr ycashok kumar", "mr. y.c.ashok kumar", "kumar"],
        response: `**Mr. Y.C.Ashok Kumar**
_Associate Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech,(Ph.D)`
    },
    {
        keywords: ["mrs pnikhitha", "pnikhitha", "mrs. p.nikhitha"],
        response: `**Mrs. P. Nikhitha**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: MS
![Mrs. P. Nikhitha](https://aliet.ac.in/storage/149/01K8WW4PHZBZZN6FJ001R2N6N5.png)`
    },
    {
        keywords: ["mrb rajashekar reddy", "rajashekar reddy", "reddy", "mr.b rajashekar reddy"],
        response: `**Mr.B Rajashekar Reddy**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Mr.B Rajashekar Reddy](https://aliet.ac.in/storage/132/01K8WVSXYA1GW3PCYNZPXNGVQA.png)`
    },
    {
        keywords: ["ms. k.reena", "ms kreena", "kreena"],
        response: `**Ms. K.Reena**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Ms. K.Reena](https://aliet.ac.in/storage/133/01K8WVTGGQPVCCTSNV8Z9FARZ1.png)`
    },
    {
        keywords: ["mounika aradhana", "ms. m. mounika aradhana", "aradhana", "ms m mounika aradhana"],
        response: `**Ms. M. Mounika Aradhana**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Ms. M. Mounika Aradhana](https://aliet.ac.in/storage/134/01K8WVVA075HPXWSQMF8SK16XW.png)`
    },
    {
        keywords: ["munni", "mrs. v munni", "mrs v munni", "v munni"],
        response: `**Mrs. V.Munni**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Mrs. V.Munni](https://aliet.ac.in/storage/153/01K8WW74WFEP2SM0P3DW4MF467.jpg)`
    },
    {
        keywords: ["baig mohammad", "mohammad", "mr md baig mohammad", "mr. md. baig mohammad"],
        response: `**Mr. MD. BAIG MOHAMMAD**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech`
    },
    {
        keywords: ["rani", "ms. m. beulah rani", "beulah rani", "ms m beulah rani"],
        response: `**Ms. M. BEULAH RANI**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Ms. M. BEULAH RANI](https://aliet.ac.in/storage/163/01K8WWZTEPRQ27CEK04B076H2C.jpg)`
    },
    {
        keywords: ["mrs. b.swathi", "mrs bswathi", "bswathi"],
        response: `**Mrs. B.Swathi**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Mrs. B.Swathi](https://aliet.ac.in/storage/136/01K8WVWZVYD23V3JNJKBGD5KCK.png)`
    },
    {
        keywords: ["p jagadish", "mr. p. jagadish", "jagadish", "mr p jagadish"],
        response: `**Mr. P.Jagadish**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Mr. P.Jagadish](https://aliet.ac.in/storage/156/01K8WW98H9YTRQ2VD9HWNF7GRQ.png)`
    },
    {
        keywords: ["srinivasa rao", "mr. a. naga srinivasa rao", "mr a naga srinivasa rao", "rao"],
        response: `**Mr. A. Naga Srinivasa Rao**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Mr. A. Naga Srinivasa Rao](https://aliet.ac.in/storage/138/01K8WVYMKJHZ48WTQ4Y3D6X7R5.png)`
    },
    {
        keywords: ["ms sprabhavathi", "sprabhavathi", "ms. s.prabhavathi"],
        response: `**Ms. S. Prabhavathi**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Ms. S. Prabhavathi](https://aliet.ac.in/storage/159/01K8WWA4WXN7R1MTWWZ7YDFNKP.png)`
    },
    {
        keywords: ["darchana", "mrs. d.archana", "mrs darchana", "archana"],
        response: `**Mrs. D.Archana**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Mrs. D.Archana](https://aliet.ac.in/storage/144/01K8WVZQY14FH14VVG8QGT23TX.png)`
    },
    {
        keywords: ["gopal", "mr. s. gopal", "mr s gopal", "s gopal"],
        response: `**Mr. S.Gopal**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Mr. S.Gopal](https://aliet.ac.in/storage/161/01K8WWB538M97H2GNXEXGFE4YT.png)`
    },
    {
        keywords: ["mr mwinson", "mwinson", "mr. m.winson"],
        response: `**Mr. M.Winson**
_Assistant Professor, CSE AI & ML / Data Science_
- Qualification: M.Tech
![Mr. M.Winson](https://aliet.ac.in/storage/146/01K8WW0Y594E60JHDXA05PEN2J.png)`
    },
    // --- Specific Departments ---
    {
        keywords: ['cse faculty', 'computer science faculty', 'cse hod', 'cse teachers'],
        response: `### 💻 Computer Science & Engineering (CSE) Faculty\n*   **Dr. L. Kanya Kumari (HOD)**\n*   Dr. K. Siva Rama Krishna, Dr. K. Sireesha, Dr. K. Venkateswara Rao, Dr. Ch. Meher Babu, Dr. Y. Prakasa Rao, Dr. M. Sumender Roy\n*   Mr. M. Samuel Sandeep, Mr. V V R Manoj, Mr. K. Satish, Mr. K. Kishore Kumar, Mr. B. N. V. Basaveswara Rao, Mr. N. Naga Vijaya Varma, Mr. K. Srinivasa Rao\n*   Mrs. Y Karuna Manjusha, Mrs. Ch Pavani, Mrs. K. Neeharika, Mrs. P. Nancy Anurag, Mrs. K. Rajeswari, Mrs. K. Sravanthi, Mrs. A. Mary Lavanya, Mrs. N. V. L. Manaswini, Mrs. B. Alekhya, Mrs. M. Naga Usha, Mrs. K. Pushpavalli, Ms. A. Iswarya Gold, Mrs. V. Rama Lakshmi, Mrs. Y. B. Pramodini, Mrs. M. Havila, Mrs. N. Rohini Krishna Sai`
    },
    {
        keywords: ['it faculty', 'information technology faculty', 'it hod', 'it teachers'],
        response: `### 🌐 Information Technology (IT) Faculty\n*   Dr. M. Chinna Rao, Dr. P. Sudheer\n*   Mr. V. Vidya Sagar, Mr. T. Kiran, Mr. K. Yaswanth\n*   Mrs. M. Kaladevi, Mrs. M. Suneela, Mrs. M. Kanthi Rekha, Ms. G. Sudha Rani, Mrs. K. Sravanthi`
    },
    {
        keywords: ['ece faculty', 'electronics faculty', 'ece hod', 'ece teachers'],
        response: `### 📡 Electronics & Communication Engineering (ECE) Faculty\n*   Dr. K. Prasanthi Jasmine, Dr. Lakshmi Narayana Thalluri, Dr. S. Mallikharjuna Rao, Dr. K. Mariya Priyadarshini\n*   Mr. Mullapudi Rama Krishna, Mr. P. Bose Babu, Mr. G. Roopa Krishna Chandra, Mr. Gorapudi Ravi, Mr. Y. Pavan Kumar, Mr. Kanakala Appala Raju, Mr. Gayala Vijay Kumar, Mr. Merugamalli Rama Krishna, Mr. Kosuru Srinivasa Rao, Mr. Abdul Azeem, Mr. Mohammad Baig Mohammad, Mr. M. Ravi Kumar, Mr. N. Bujji Babu\n*   Mrs. B. Santhi Kiran, Mrs. T. Manogna`
    },
    {
        keywords: ['eee faculty', 'electrical faculty', 'eee hod', 'eee teachers'],
        response: `### ⚡ Electrical & Electronics Engineering (EEE) Faculty\n*   Dr. G. Naveen Kumar, Dr. M. Ajay Kumar, Dr. V. Anantha Lakshmi, Dr. G. Gantaiah Swamy\n*   Mr. L. Karunakar, Mr. T. Krishna Mohan, Mr. M. Rama Krishna, Mr. V. Brahmeswara Rao\n*   Ms. B. Sruthi, Ms. A. Chandhni Srilakshmi`
    },
    {
        keywords: ['civil faculty', 'civil hod', 'civil teachers'],
        response: `### 🏗️ Civil Engineering Faculty\n*   Mr. K. Kiran Kumar, Mr. K. Mallikarjuna Rao, Mr. N. Abhilash, Mr. Nagaraju Chanumolu, Mr. V. Suryateja\n*   Mrs. A. Tejaswi, Mrs. V. Swathi Padmaja, Ms. G. Mahitha`
    },
    {
        keywords: ['mech faculty', 'mechanical faculty', 'mech hod', 'mechanical teachers'],
        response: `### ⚙️ Mechanical Engineering Faculty
*   Dr. O. Mahesh, Dr. M. Geeta Rani, Dr. B. Sudheer Kumar, Dr. G. G. Srinivasu, Dr. T. Subba Reddy
*   Mr. M. Sudhakar, Mr. Ch. Ranga Rao, Mr. M. Srinivasa Reddy, Mr. M. Teja Swarup, Mr. E. Durgesh, Mr. K. Uday Kiran
*   Mrs. B. Susmitha`
    },
    {
        keywords: ['cse ai ml faculty', 'ai ml faculty', 'ai ml teachers', 'cse ai ml hod'],
        response: `### 🤖 CSE (AI & ML) Faculty
*   **Dr. K. Siva Rama Krishna**
*   Dr. M. Chinna Rao
*   Mr. Y.C. Ashok Kumar, Mr. B. Rajashekar Reddy, Mr. MD. Baig Mohammad, Mr. P. Jagadish, Mr. A. Naga Srinivasa Rao, Mr. S. Gopal, Mr. M. Winson
*   Mrs. P. Nikhitha, Mrs. V. Munni, Mrs. B. Swathi, Mrs. D. Archana
*   Ms. K. Reena, Ms. M. Mounika Aradhana, Ms. M. Beulah Rani, Ms. S. Prabhavathi`
    },
    {
        keywords: ['cse ds faculty', 'cse data science faculty', 'data science faculty', 'ds faculty'],
        response: `### 📊 CSE (Data Science) Faculty
*   Mr. P. Jagadish, Mr. S. Gopal
*   Mrs. P. Nikhitha, Mrs. V. Munni
*   Ms. S. Prabhavathi`
    },
    {
        keywords: ['mba faculty', 'mba teachers', 'mba hod', 'management faculty'],
        response: `### 📈 Master of Business Administration (MBA) Faculty
*   **Dr. M. Vijay Kumar (HOD)**
*   Dr. G. Lalitha Madhavi, Dr. K. Sattibabu, Dr. B. Shanti, Dr. M. Indira
*   Sk. Razia Begum`
    },
    {
        keywords: ['s&h faculty', 'science humanities faculty', 's&h teachers', 's&h hod'],
        response: `### 🧪 Science & Humanities (S&H) Faculty
*   **Dr. Y. Sudhakar (HOD)**
*   Dr. V. V. Prabhakar Rao, Dr. P. Sudha Rani, Dr. N. DyvaKrupa, Dr. Sr. Candy D'Cunha, Dr. Ch. Vijaya Lakshmi, Dr. T. Kalpana, Mr. P. Sugandha kumar
*   Mr. Y. Rajesh (Physical Director), Mr. B. Ravi Shankar, Mr. A. Kalyan Kumar, Mr. T. Sujith
*   Mrs. K. Swathi Kiran, Mrs. E. Kalavathi, Mrs. M. Archana, Mrs. S. Saritha, Mrs. B. Sailaja, Mrs. M. Vijaya Lakshmi
*   Ms. S. P. V. N. D. Sumalatha, Ms. B. Sarath Kumari, Ms. K. Rajya Lakshmi, Ms. K. Leela Prasanna, Ms. K. Vasantha Lakshmi, Ms. B. TripuraSri Satvika, Ms. Parimala Jyothi`
    },

    // --- Catch-all Faculty Rule (placed after specific departments so specifics match first) ---
    {
        keywords: ['faculty', 'teachers', 'professors', 'hod', 'staff', 'department faculty'],
        response: `👨‍🏫 **ALIET Faculty Directory**

We have distinguished faculty across all departments:
- **CSE** (General, AI & ML, Data Science)
- **IT** (Information Technology)
- **ECE** (Electronics & Communication)
- **EEE** (Electrical & Electronics)
- **Civil** Engineering
- **Mechanical** Engineering
- **MBA** (Business Administration)
- **S&H** (Science & Humanities)

_Ask me for a specific department's faculty (e.g., "CSE AI ML faculty") for detailed staff lists._`
    },

    // --- Centers of Excellence Rule ---
    {
        keywords: ['excellence', 'coe', 'centers', 'centers of excellence', 'siemens', 'apssdc'],
        response: `### 🚀 Centers of Excellence\n- **Siemens Training Centre**: Industry-standard automation & digitalization.\n- **CM's Excellence Centre**: Government recognized training hub.\n- **Skill Development Centre**: Partnered with APSSDC for advanced training.`
    },

    // --- Catch-all College Rule ---
    {
        keywords: ['aliet', 'college', 'my college', 'andhra loyola'],
        response: `🏥 **Andhra Loyola Institute of Engineering & Technology (ALIET)**\n\n**Motto**: _Service & Excellence_\n**Established**: 2008 (Managed by Jesuits)\n**Accreditation**: NAAC A+ Accredited | Affiliated to JNTU Kakinada\n\n---\n\n### 🏛️ Quick Facts\n- **Campus**: Verdant 98-acre campus at the foothills of Eastern Ghats.\n- **Departments**: 8 B.Tech programs (CSE, AI&ML, Data Science, IT, ECE, EEE, MECH, CIVIL) & 3 PG programs.\n- **Sister Institution**: Andhra Loyola College (est. 1953).\n\nLet me know if you want to know about our **leadership** (Principal, Director), **centers of excellence**, or specific **department faculty**! 🎓`
    }
];
