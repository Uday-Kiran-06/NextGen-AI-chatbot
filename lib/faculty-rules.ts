import { Rule } from './rules-data';

export const FACULTY_RULES: Rule[] = [
    // --- CSE ---
    {
        keywords: ['cse faculty', 'cse department faculty', 'computer science faculty'],
        response: "📚 **Computer Science & Engineering (CSE) Faculty Members**:\n\n" +
            "1. [Dr. L. Kanya Kumari](send:Dr. L. Kanya Kumari)\n" +
            "2. [Dr. K. Sireesha](send:Dr. K. Sireesha)\n" +
            "3. [Mr. M. Samuel Sandeep](send:Mr. M. Samuel Sandeep)\n" +
            "4. [Dr. K. Venkateswara Rao](send:Dr. K. Venkateswara Rao)\n" +
            "5. [Mr. V V R Manoj](send:Mr. V V R Manoj)\n" +
            "6. [Mrs. Y Karuna Manjusha](send:Mrs. Y Karuna Manjusha)\n" +
            "7. [Mrs. Ch Pavani](send:Mrs. Ch Pavani)\n" +
            "8. [Mrs K Neeharika](send:Mrs K Neeharika)\n" +
            "9. [Mrs P Nancy Anurag](send:Mrs P Nancy Anurag)\n" +
            "10. [Mr K Satish](send:Mr K Satish)\n" +
            "11. [Mrs K Rajeswari](send:Mrs K Rajeswari)\n" +
            "12. [Mr K Kishore Kumar](send:Mr K Kishore Kumar)\n" +
            "13. [Mrs K Sravanthi](send:Mrs K Sravanthi)\n" +
            "14. [Mrs A Mary Lavanya](send:Mrs A Mary Lavanya)\n" +
            "15. [Mrs N V L Manaswini](send:Mrs N V L Manaswini)\n" +
            "16. [Mrs B Alekhya](send:Mrs B Alekhya)\n" +
            "17. [Mrs M Naga Usha](send:Mrs M Naga Usha)\n" +
            "18. [Mrs K Pushpavalli](send:Mrs K Pushpavalli)\n" +
            "19. [Ms A Iswarya Gold](send:Ms A Iswarya Gold)\n" +
            "20. [Mrs V Rama Lakshmi](send:Mrs V Rama Lakshmi)\n" +
            "21. [Dr Ch Meher Babu](send:Dr Ch Meher Babu)\n" +
            "22. [Mrs Y B Pramodini](send:Mrs Y B Pramodini)\n" +
            "23. [Mr B N V Basaveswara Rao](send:Mr B N V Basaveswara Rao)\n" +
            "24. [Mrs M Havila](send:Mrs M Havila)\n" +
            "25. [Mr N Naga Vijaya Varma](send:Mr N Naga Vijaya Varma)\n" +
            "26. [Dr Y Prakasa Rao](send:Dr Y Prakasa Rao)\n" +
            "27. [Mrs N Rohini Krishna Sai](send:Mrs N Rohini Krishna Sai)\n" +
            "28. [Dr M Sumender Roy](send:Dr M Sumender Roy)\n\n" +
            "Click on any name to view their full profile! ✨"
    },
    { keywords: ['kanya kumari', 'cse hod', 'hod of cse'], response: "🎓 **Dr. L. Kanya Kumari** is the Associate Professor & HOD of Computer Science & Engineering. Qualification: Ph.D.\n\n![Dr. L. Kanya Kumari](https://aliet.ac.in/storage/blocks/01K8D7KSJP7WKG90BWDEF4Q9EW.jpg)" },
    { keywords: ['sireesha', 'cse faculty'], response: "👤 **Dr. K. Sireesha** is an Associate Professor in the CSE department. Qualification: Ph.D." },
    { keywords: ['samuel sandeep', 'cse faculty'], response: "👤 **Mr. M. Samuel Sandeep** is an Associate Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['venkateswara rao', 'cse faculty'], response: "👤 **Dr. K. Venkateswara Rao** is an Assistant Professor in the CSE department. Qualification: Ph.D." },
    { keywords: ['manoj', 'cse faculty'], response: "👤 **Mr. V V R Manoj** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['karuna manjusha', 'cse faculty'], response: "👤 **Mrs. Y Karuna Manjusha** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['pavani', 'cse faculty'], response: "👤 **Mrs. Ch Pavani** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['neeharika', 'cse faculty'], response: "👤 **Mrs K Neeharika** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['nancy anurag', 'cse faculty'], response: "👤 **Mrs P Nancy Anurag** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['satish', 'cse faculty'], response: "👤 **Mr K Satish** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['rajeswari', 'cse faculty'], response: "👤 **Mrs K Rajeswari** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['kishore kumar', 'cse faculty'], response: "👤 **Mr K Kishore Kumar** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['sravanthi', 'cse faculty'], response: "👤 **Mrs K Sravanthi** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['mary lavanya', 'cse faculty'], response: "👤 **Mrs A Mary Lavanya** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['manaswini', 'cse faculty'], response: "👤 **Mrs N V L Manaswini** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['alekhya', 'cse faculty'], response: "👤 **Mrs B Alekhya** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['naga usha', 'cse faculty'], response: "👤 **Mrs M Naga Usha** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['pushpavalli', 'cse faculty'], response: "👤 **Mrs K Pushpavalli** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['iswarya gold', 'cse faculty'], response: "👤 **Ms A Iswarya Gold** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['rama lakshmi', 'cse faculty'], response: "👤 **Mrs V Rama Lakshmi** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['meher babu', 'cse faculty'], response: "👤 **Dr Ch Meher Babu** is an Assistant Professor in the CSE department. Qualification: Ph.D." },
    { keywords: ['pramodini', 'cse faculty'], response: "👤 **Mrs Y B Pramodini** is an Assistant Professor in the CSE department. Qualification: M.S" },
    { keywords: ['basaveswara rao', 'cse faculty'], response: "👤 **Mr B N V Basaveswara Rao** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['havila', 'cse faculty'], response: "👤 **Mrs M Havila** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['vijaya varma', 'cse faculty'], response: "👤 **Mr N Naga Vijaya Varma** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['prakasa rao', 'cse faculty'], response: "👤 **Dr Y Prakasa Rao** is an Assistant Professor in the CSE department. Qualification: Ph.D." },
    { keywords: ['rohini krishna sai', 'cse faculty'], response: "👤 **Mrs N Rohini Krishna Sai** is an Assistant Professor in the CSE department. Qualification: M.Tech" },
    { keywords: ['sumender roy', 'cse faculty'], response: "👤 **Dr M Sumender Roy** is an Associate Professor in the CSE department. Qualification: Ph.D." },
    {
        keywords: ['it faculty', 'it department faculty', 'information technology faculty'],
        response: "📚 **Information Technology (IT) Faculty Members**:\n\n" +
            "1. [Mr. V. Vidya Sagar](send:Mr. V. Vidya Sagar)\n" +
            "2. [Mrs. M. Kaladevi](send:Mrs. M. Kaladevi)\n" +
            "3. [Mr. T. Kiran](send:Mr. T. Kiran)\n" +
            "4. [Mrs. M. Suneela](send:Mrs. M. Suneela)\n" +
            "5. [Mrs. M. Kanthi Rekha](send:Mrs. M. Kanthi Rekha)\n" +
            "6. [Ms. G. Sudha Rani](send:Ms. G. Sudha Rani)\n" +
            "7. [Mr. K. Yaswanth](send:Mr. K. Yaswanth)\n" +
            "8. [Dr. M. Chinna Rao](send:Dr. M. Chinna Rao)\n" +
            "9. [Dr. P. Sudheer](send:Dr. P. Sudheer)\n" +
            "10. [Mrs. K. Sravanthi](send:Mrs. K. Sravanthi)\n\n" +
            "Click on any name to view their full profile! ✨"
    },
    { keywords: ['vidya sagar', 'it hod', 'hod of it'], response: "🎓 **Mr. V. Vidya Sagar** is the Associate Professor & HOD of Information Technology. Qualification: M.Tech\n\n![Mr. V. Vidya Sagar](https://aliet.ac.in/storage/2/01K8J0WTGMM67DG79R015TEXF7.jpg)" },
    { keywords: ['kaladevi', 'it faculty'], response: "👤 **Mrs. M. Kaladevi** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Mrs. M. Kaladevi](https://aliet.ac.in/storage/336/01K99FWTWW1BEZVH0QEYD5Z77S.jpg)" },
    { keywords: ['t. kiran', 'it faculty'], response: "👤 **Mr. T. Kiran** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Mr. T. Kiran](https://aliet.ac.in/storage/323/01K94TP2WAPNW7N7BG9DCD71BK.jpg)" },
    { keywords: ['suneela', 'it faculty'], response: "👤 **Mrs. M. Suneela** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Mrs. M. Suneela](https://aliet.ac.in/storage/337/01K99FYVKKSBPCBW3CPQCVJYHZ.jpg)" },
    { keywords: ['kanthi rekha', 'it faculty'], response: "👤 **Mrs. M. Kanthi Rekha** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Mrs. M. Kanthi Rekha](https://aliet.ac.in/storage/338/01K99FZFZW2T55VXMD9GBJBP7G.jpg)" },
    { keywords: ['sudha rani', 'it faculty'], response: "👤 **Ms. G. Sudha Rani** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Ms. G. Sudha Rani](https://aliet.ac.in/storage/324/01K94TVYM74NMAGWKHFXHJ43D6.jpg)" },
    { keywords: ['yaswanth', 'it faculty'], response: "👤 **Mr. K. Yaswanth** is an Assistant Professor in the IT department. Qualification: M.Tech\n\n![Mr. K. Yaswanth](https://aliet.ac.in/storage/325/01K94V06BG4G7F0RARR5GWG4V0.jpg)" },
    { keywords: ['chinna rao', 'it faculty'], response: "👤 **Dr. M. Chinna Rao** is an Associate Professor in the IT department. Qualification: Ph.D." },
    { keywords: ['sudheer', 'it faculty'], response: "👤 **Dr. P. Sudheer** is an Assistant Professor in the IT department. Qualification: Ph.D.\n\n![Dr. P. Sudheer](https://aliet.ac.in/storage/326/01K94V42X9T1463G2P0JCEN0F0.jpg)" },
    { keywords: ['sravanthi', 'it faculty'], response: "👤 **Mrs. K. Sravanthi** is an Assistant Professor in the IT department. Qualification: M.Tech" },

    // --- ECE ---
    {
        keywords: ['ece faculty', 'ece department faculty', 'electronics faculty'],
        response: "📚 **Electronics & Communication Engineering (ECE) Faculty Members**:\n\n" +
            "1. [Dr. K. Prasanthi Jasmine](send:Dr. K. Prasanthi Jasmine)\n" +
            "2. [Mr. Mullapudi Rama Krishna](send:Mr. Mullapudi Rama Krishna)\n" +
            "3. [Dr. Lakshmi Narayana Thalluri](send:Dr. Lakshmi Narayana Thalluri)\n" +
            "4. [Dr. S. Mallikharjuna Rao](send:Dr. S. Mallikharjuna Rao)\n" +
            "5. [Dr. K. Mariya Priyadarshani](send:Dr. K. Mariya Priyadarshani)\n" +
            "6. [Mrs. B. Santhi Kiran](send:Mrs. B. Santhi Kiran)\n" +
            "7. [Mr. P. Bose Babu](send:Mr. P. Bose Babu)\n" +
            "8. [Mr. G. Roopa Krishna Chandra](send:Mr. G. Roopa Krishna Chandra)\n" +
            "9. [Mr. Gorapudi Ravi](send:Mr. Gorapudi Ravi)\n" +
            "10. [Mr. Y. Pavan Kumar](send:Mr. Y. Pavan Kumar)\n" +
            "11. [Mr. Kanakala Appala Raju](send:Mr. Kanakala Appala Raju)\n" +
            "12. [Mr. Gayala Vijay Kumar](send:Mr. Gayala Vijay Kumar)\n" +
            "13. [Mr. Merugamalli Rama Krishna](send:Mr. Merugamalli Rama Krishna)\n" +
            "14. [Mr. Kosuru Srinivasa Rao](send:Mr. Kosuru Srinivasa Rao)\n" +
            "15. [Mr. Abdul Azeem](send:Mr. Abdul Azeem)\n" +
            "16. [Mr. MD. Baig Mohammad](send:Mr. MD. Baig Mohammad)\n" +
            "17. [Mr. M. Ravi Kumar](send:Mr. M. Ravi Kumar)\n" +
            "18. [Mrs. T. Manogna](send:Mrs. T. Manogna)\n" +
            "19. [Mr. N. Bujji Babu](send:Mr. N. Bujji Babu)\n\n" +
            "Click on any name to view their full profile! ✨"
    },
    { keywords: ['jasmine', 'ece faculty'], response: "👤 **Dr. K. Prasanthi Jasmine** is a Professor in the ECE department. Qualification: Ph.D.\n\n![Dr. K. Prasanthi Jasmine](https://aliet.ac.in/storage/471/01KADH1XVR4QESD8MJZWAWHWTF.png)" },
    { keywords: ['mullapudi rama krishna', 'ece faculty'], response: "👤 **Mr. Mullapudi Rama Krishna** is an Associate Professor in the ECE department. Qualification: M.Tech\n\n![Mr. Mullapudi Rama Krishna](https://aliet.ac.in/storage/529/01KATRGRM8KKCGK40K896WMAB7.jpg)" },
    { keywords: ['thalluri', 'ece hod', 'hod of ece'], response: "🎓 **Dr. Lakshmi Narayana Thalluri** is the Associate Professor & HOD of ECE. Qualification: Ph.D.\n\n![Dr. Lakshmi Narayana Thalluri](https://aliet.ac.in/storage/732/01KC497DZQDDRF80BS88QJKP7X.jpg)" },
    { keywords: ['mallikharjuna rao', 'ece faculty'], response: "👤 **Dr. S. Mallikharjuna Rao** is an Associate Professor in the ECE department. Qualification: Ph.D.\n\n![Dr. S. Mallikharjuna Rao](https://aliet.ac.in/storage/523/01KANJ9PWJM98A2ATN9QJKHV6E.jpg)" },
    { keywords: ['mariya priyadarshini', 'ece faculty'], response: "👤 **Dr. K. Mariya Priyadarshani** is an Assistant Professor in the ECE department. Qualification: Ph.D.\n\n![Dr. K. Mariya Priyadarshini](https://aliet.ac.in/storage/517/01KANF1WFX15064KJVKBJAH0EJ.png)" },
    { keywords: ['santhi kiran', 'ece faculty'], response: "👤 **Mrs. B. Santhi Kiran** is an Associate Professor in the ECE department. Qualification: M.Tech\n\n![Mrs. B. Santhi Kiran](https://aliet.ac.in/storage/518/01KANFARNXD8RT8CGDGYMJCVJQ.jpg)" },
    { keywords: ['bose babu', 'ece faculty'], response: "👤 **Mr. P. Bose Babu** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. P. Bose Babu](https://aliet.ac.in/storage/527/01KAT832V3DW7Y641ET87WBAJQ.jpg)" },
    { keywords: ['roopa krishna chandra', 'ece faculty'], response: "👤 **Mr. G. Roopa Krishna Chandra** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. G. Roopa Krishna Chandra](https://aliet.ac.in/storage/526/01KAT7W4HY4RTMC6A22MCATZ0W.jpg)" },
    { keywords: ['ravi', 'gorapudi ravi', 'ece faculty'], response: "👤 **Mr. Gorapudi Ravi** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. Gorapudi Ravi](https://aliet.ac.in/storage/524/01KANJGQKDWACSSX002JCJV6Y3.jpg)" },
    { keywords: ['pavan kumar', 'ece faculty'], response: "👤 **Mr. Y. Pavan Kumar** is an Assistant Professor in the ECE department. Qualification: M.Tech" },
    { keywords: ['appala raju', 'ece faculty'], response: "👤 **Mr. Kanakala Appala Raju** is an Assistant Professor in the ECE department. Qualification: M.Tech" },
    { keywords: ['vijay kumar', 'gayala vijay kumar', 'ece faculty'], response: "👤 **Mr. Gayala Vijay Kumar** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. Gayala Vijay Kumar](https://aliet.ac.in/storage/521/01KANHSDW3STYXSZPJJME8XDWK.jpg)" },
    { keywords: ['merugamalli rama krishna', 'ece faculty'], response: "👤 **Mr. Merugamalli Rama Krishna** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. Merugamalli Rama Krishna](https://aliet.ac.in/storage/519/01KANFP0NTKQSJFJCDJ17JTDCT.jpg)" },
    { keywords: ['kosuru srinivasa rao', 'ece faculty'], response: "👤 **Mr. Kosuru Srinivasa Rao** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. Kosuru Srinivasa Rao](https://aliet.ac.in/storage/520/01KANFVC3BFMF43NB2KAK48PM0.jpg)" },
    { keywords: ['abdul azeem', 'ece faculty'], response: "👤 **Mr. Abdul Azeem** is an Assistant Professor in the ECE department. Qualification: M.Tech" },
    { keywords: ['baig mohammad', 'ece faculty'], response: "👤 **Mr. MD. Baig Mohammad** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. MD. Baig Mohammad](https://aliet.ac.in/storage/528/01KATR9EDNSHPH7Q2Y21FKHQAP.jpg)" },
    { keywords: ['ravi kumar', 'ece faculty'], response: "👤 **Mr. M. Ravi Kumar** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mr. M. Ravi Kumar](https://aliet.ac.in/storage/525/01KANJVFRH8WBFKEPKJ9XM5SYD.jpg)" },
    { keywords: ['manogna', 'ece faculty'], response: "👤 **Mrs. T. Manogna** is an Assistant Professor in the ECE department. Qualification: M.Tech\n\n![Mrs. T. Manogna](https://aliet.ac.in/storage/516/01KANEKAR96MF9ATETK428PE7S.jpg)" },
    { keywords: ['bujji babu', 'ece faculty'], response: "👤 **Mr. N. Bujji Babu** is an Assistant Professor in the ECE department. Qualification: M.Tech" },

    // --- CSE AI & ML ---
    {
        keywords: ['ai ml faculty', 'cse ai ml faculty', 'artificial intelligence faculty'],
        response: "📚 **CSE (AI & ML) Faculty Members**:\n\n" +
            "1. [Dr. K. Siva Rama Krishna](send:Dr. K. Siva Rama Krishna)\n" +
            "2. [Mr. Y. C. Ashok Kumar](send:Mr. Y. C. Ashok Kumar)\n" +
            "3. [Mrs. P. Nikhitha](send:Mrs. P. Nikhitha)\n" +
            "4. [Mr. B. Rajashekar Reddy](send:Mr. B. Rajashekar Reddy)\n" +
            "5. [Ms. K. Reena](send:Ms. K. Reena)\n" +
            "6. [Ms. M. Mounika Aradhana](send:Ms. M. Mounika Aradhana)\n" +
            "7. [Mrs. V. Munni](send:Mrs. V. Munni)\n" +
            "8. [Mr. MD. BAIG MOHAMMAD](send:Mr. MD. BAIG MOHAMMAD)\n" +
            "9. [Dr. M. CHINNA Rao](send:Dr. M. CHINNA Rao)\n" +
            "10. [Ms. M. BEULAH RANI](send:Ms. M. BEULAH RANI)\n" +
            "11. [Mrs. B. Swathi](send:Mrs. B. Swathi)\n" +
            "12. [Mr. P. Jagadish](send:Mr. P. Jagadish)\n" +
            "13. [Mr. A. Naga Srinivasa Rao](send:Mr. A. Naga Srinivasa Rao)\n" +
            "14. [Ms. S. Prabhavathi](send:Ms. S. Prabhavathi)\n" +
            "15. [Mrs. D. Archana](send:Mrs. D. Archana)\n" +
            "16. [Mr. S. Gopal](send:Mr. S. Gopal)\n" +
            "17. [Mr. M. Winson](send:Mr. M. Winson)\n\n" +
            "Click on any name to view their full profile! ✨"
    },
    { keywords: ['siva rama krishna', 'ai ml faculty'], response: "👤 **Dr. K. Siva Rama Krishna** is an Associate Professor in CSE (AI & ML). Qualification: Ph.D.\n\n![Dr. K. Siva Rama Krishna](https://aliet.ac.in/storage/120/01K8WVMA7V90D4T9SA49ZF2EQE.png)" },
    { keywords: ['ashok kumar', 'ai ml faculty'], response: "👤 **Mr. Y. C. Ashok Kumar** is an Associate Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. Y. C. Ashok Kumar](https://aliet.ac.in/storage/126/01K8WVQGNQ9PNCKCNF4128TSF3.png)" },
    { keywords: ['nikhitha', 'ai ml faculty'], response: "👤 **Mrs. P. Nikhitha** is an Assistant Professor in CSE (AI & ML). Qualification: MS\n\n![Mrs. P. Nikhitha](https://aliet.ac.in/storage/131/01K8WVR5CQ45TFQMQD0BJWK8MT.png)" },
    { keywords: ['rajashekar reddy', 'ai ml faculty'], response: "👤 **Mr. B Rajashekar Reddy** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. B Rajashekar Reddy](https://aliet.ac.in/storage/132/01K8WVSXYA1GW3PCYNZPXNGVQA.png)" },
    { keywords: ['reena', 'ai ml faculty'], response: "👤 **Ms. K. Reena** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Ms. K. Reena](https://aliet.ac.in/storage/133/01K8WVTGGQPVCCTSNV8Z9FARZ1.png)" },
    { keywords: ['mounika aradhana', 'ai ml faculty'], response: "👤 **Ms. M. Mounika Aradhana** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Ms. M. Mounika Aradhana](https://aliet.ac.in/storage/134/01K8WVVA075HPXWSQMF8SK16XW.png)" },
    { keywords: ['munni', 'ai ml faculty'], response: "👤 **Mrs. V. Munni** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mrs. V. Munni](https://aliet.ac.in/storage/109/01K8WVGW6Y0A9HTJYKTZAWMWK9.jpg)" },
    { keywords: ['baig mohammad', 'ai ml faculty'], response: "👤 **Mr. MD. BAIG MOHAMMAD** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech" },
    { keywords: ['chinna rao', 'ai ml faculty'], response: "👤 **Dr. M. CHINNA RAO** is an Associate Professor in CSE (AI & ML). Qualification: Ph.D.\n\n![Dr. M. CHINNA RAO](https://aliet.ac.in/storage/135/01K8WVW3BMMN382E1DN6118YMV.png)" },
    { keywords: ['beulah rani', 'ai ml faculty'], response: "👤 **Ms. M. BEULAH RANI** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Ms. M. BEULAH RANI](https://aliet.ac.in/storage/163/01K8WWZTEPRQ27CEK04B076H2C.jpg)" },
    { keywords: ['swathi', 'ai ml faculty'], response: "👤 **Mrs. B. Swathi** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mrs. B. Swathi](https://aliet.ac.in/storage/136/01K8WVWZVYD23V3JNJKBGD5KCK.png)" },
    { keywords: ['jagadish', 'ai ml faculty'], response: "👤 **Mr. P. Jagadish** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. P. Jagadish](https://aliet.ac.in/storage/137/01K8WVXMW66QD5CDB90C6YJRJ7.png)" },
    { keywords: ['naga srinivasa rao', 'ai ml faculty'], response: "👤 **Mr. A. Naga Srinivasa Rao** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. A. Naga Srinivasa Rao](https://aliet.ac.in/storage/138/01K8WVYMKJHZ48WTQ4Y3D6X7R5.png)" },
    { keywords: ['prabhavathi', 'ai ml faculty'], response: "👤 **Ms. S. Prabhavathi** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Ms. S. Prabhavathi](https://aliet.ac.in/storage/143/01K8WVZ65T0ZJ7QVNYYAP3ENW4.png)" },
    { keywords: ['archana', 'ai ml faculty'], response: "👤 **Mrs. D. Archana** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mrs. D. Archana](https://aliet.ac.in/storage/144/01K8WVZQY14FH14VVG8QGT23TX.png)" },
    { keywords: ['gopal', 'ai ml faculty'], response: "👤 **Mr. S. Gopal** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. S. Gopal](https://aliet.ac.in/storage/145/01K8WW08XZ7PRCPSZ0HQ5VQF0R.png)" },
    { keywords: ['winson', 'ai ml faculty'], response: "👤 **Mr. M. Winson** is an Assistant Professor in CSE (AI & ML). Qualification: M.Tech\n\n![Mr. M. Winson](https://aliet.ac.in/storage/146/01K8WW0Y594E60JHDXA05PEN2J.png)" },

    // --- Mechanical ---
    {
        keywords: ['mechanical faculty', 'mechanical department faculty'],
        response: "📚 **Mechanical Engineering Faculty Members**:\n\n" +
            "1. [Dr. O. Mahesh](send:Dr. O. Mahesh)\n" +
            "2. [Dr. M. Geeta Rani](send:Dr. M. Geeta Rani)\n" +
            "3. [Dr. B. Sudheer Kumar](send:Dr. B. Sudheer Kumar)\n" +
            "4. [Mr. M. Sudhakar](send:Mr. M. Sudhakar)\n" +
            "5. [Mr. Ch. Ranga Rao](send:Mr. Ch. Ranga Rao)\n" +
            "6. [Mrs. B. Susmitha](send:Mrs. B. Susmitha)\n" +
            "7. [Mr. M. Srinivasa Reddy](send:Mr. M. Srinivasa Reddy)\n" +
            "8. [Mr. M. Teja Swarup](send:Mr. M. Teja Swarup)\n" +
            "9. [Dr. G. G. Srinivasu](send:Dr. G. G. Srinivasu)\n" +
            "10. [Mr. E. Durgesh](send:Mr. E. Durgesh)\n" +
            "11. [Dr. T. Subba Reddy](send:Dr. T. Subba Reddy)\n" +
            "12. [Mr. K. Uday Kiran](send:Mr. K. Uday Kiran)\n\n" +
            "Click on any name to view their full profile! ✨"
    },
    { keywords: ['mahesh', 'mechanical faculty', 'principal'], response: "🎓 **Dr. O. Mahesh** is a Professor in Mechanical Engineering and also the **Principal** of ALIET. Qualification: Ph.D." },
    { keywords: ['geeta rani', 'mechanical faculty', 'hod of mechanical'], response: "🎓 **Dr. M. Geeta Rani** is an Associate Professor and HOD in Mechanical Engineering. Qualification: Ph.D.\n\n![Dr. M. Geeta Rani](https://aliet.ac.in/storage/blocks/01K8ZF53KJKDJFN9HA6V63SDAS.PNG)" },
    { keywords: ['sudheer kumar', 'mechanical faculty'], response: "👤 **Dr. B. Sudheer Kumar** is an Associate Professor in Mechanical Engineering. Qualification: Ph.D." },
    { keywords: ['m. sudhakar', 'mechanical faculty'], response: "👤 **Mr. M. Sudhakar** is an Associate Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['ranga rao', 'mechanical faculty'], response: "👤 **Mr. Ch. Ranga Rao** is an Associate Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['susmitha', 'mechanical faculty'], response: "👤 **Mrs. B. Susmitha** is an Assistant Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['srinivasa reddy', 'mechanical faculty'], response: "👤 **Mr. M. Srinivasa Reddy** is an Assistant Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['teja swarup', 'mechanical faculty'], response: "👤 **Mr. M. Teja Swarup** is an Assistant Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['srinivasu', 'mechanical faculty'], response: "👤 **Dr. G. G. Srinivasu** is an Assistant Professor in the Mechanical department. Qualification: Ph.D." },
    { keywords: ['durgesh', 'mechanical faculty'], response: "👤 **Mr. E. Durgesh** is an Assistant Professor in the Mechanical department. Qualification: M.Tech" },
    { keywords: ['subba reddy', 'mechanical faculty'], response: "👤 **Dr. T. Subba Reddy** is an Assistant Professor in the Mechanical department. Qualification: Ph.D.\n\n![Dr. T. Subba Reddy](https://aliet.ac.in/storage/8/01K8W79709NQTGPYBFYNE1CZ5W.jpg)" },
    { keywords: ['uday kiran', 'mechanical faculty'], response: "👤 **Mr. K. Uday Kiran** is a Faculty Member in the Mechanical department. Qualification: M.Tech" },

    // --- Civil ---
    {
        keywords: ['civil faculty', 'civil department faculty'],
        response: "📚 **Civil Engineering Faculty Members**:\n\n" +
            "1. [Mrs. A. Tejaswi](send:Mrs. A. Tejaswi)\n" +
            "2. [Mr. Nagaraju Chanumolu](send:Mr. Nagaraju Chanumolu)\n" +
            "3. [Mr. N. Abhilash](send:Mr. N. Abhilash)\n" +
            "4. [Mrs. V. Swathi Padmaja](send:Mrs. V. Swathi Padmaja)\n" +
            "5. [Mr. V. Suryateja](send:Mr. V. Suryateja)\n" +
            "6. [Mr. K. Kiran Kumar](send:Mr. K. Kiran Kumar)\n" +
            "7. [Mr. K. Mallikarjuna Rao](send:Mr. K. Mallikarjuna Rao)\n" +
            "8. [Ms. G. Mahitha](send:Ms. G. Mahitha)\n\n" +
            "Click on any name to view their full profile! ✨"
    },
    { keywords: ['tejaswi', 'civil faculty'], response: "👤 **Mrs. A. Tejaswi** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['nagaraju', 'civil hod', 'hod of civil'], response: "🎓 **Mr. Nagaraju Chanumolu** is the Associate Professor & HOD of Civil Engineering. Qualification: M.Tech\n\n![Mr. Nagaraju Chanumolu](https://aliet.ac.in/storage/blocks/01K99GGNWGA944CTW4WE18YFW9.jpg)" },
    { keywords: ['abhilash', 'civil faculty'], response: "👤 **Mr. N. Abhilash** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['swathi padmaja', 'civil faculty'], response: "👤 **Mrs. V. Swathi Padmaja** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['suryateja', 'civil faculty'], response: "👤 **Mr. V. Suryateja** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['kiran kumar', 'civil faculty'], response: "👤 **Mr. K. Kiran Kumar** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['mallikarjuna rao', 'civil faculty'], response: "👤 **Mr. K. Mallikarjuna Rao** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },
    { keywords: ['mahitha', 'civil faculty'], response: "👤 **Ms. G. Mahitha** is an Assistant Professor in Civil Engineering. Qualification: M.Tech" },

    // --- EEE ---
    {
        keywords: ['eee faculty', 'eee department faculty', 'electrical faculty'],
        response: "📚 **Electrical & Electronics Engineering (EEE) Faculty Members**:\n\n" +
            "1. [Dr. G. Naveen Kumar](send:Dr. G. Naveen Kumar)\n" +
            "2. [Dr. M. Ajay Kumar](send:Dr. M. Ajay Kumar)\n" +
            "3. [Dr. V. Anantha Lakshmi](send:Dr. V. Anantha Lakshmi)\n" +
            "4. [Dr. G. Gantaiah Swamy](send:Dr. G. Gantaiah Swamy)\n" +
            "5. [Mr. L. Karunakar](send:Mr. L. Karunakar)\n" +
            "6. [Mr. T. Krishna Mohan](send:Mr. T. Krishna Mohan)\n" +
            "7. [Mr. M. Rama Krishna](send:Mr. M. Rama Krishna)\n" +
            "8. [Mr. V. Brahmeswara Rao](send:Mr. V. Brahmeswara Rao)\n" +
            "9. [Ms. B. Sruthi](send:Ms. B. Sruthi)\n" +
            "10. [Ms. A. Chandhni Srilakshmi](send:Ms. A. Chandhni Srilakshmi)\n\n" +
            "Click on any name to view their full profile! ✨"
    },
    { keywords: ['naveen kumar', 'eee hod', 'hod of eee'], response: "🎓 **Dr. G. Naveen Kumar** is the Professor & HOD of Electrical & Electronics Engineering. Qualification: Ph.D.\n\n![Dr. G. Naveen Kumar](https://aliet.ac.in/storage/177/01K8Z0B5EYQQPY7Q89P3KG4X90.jpg)" },
    { keywords: ['ajay kumar', 'eee faculty'], response: "👤 **Dr. M. Ajay Kumar** is an Associate Professor in EEE. Qualification: Ph.D.\n\n![Dr. M. Ajay Kumar](https://aliet.ac.in/storage/178/01K8Z30ZXATGDKZSEWNQ06X3WB.jpg)" },
    { keywords: ['anantha lakshmi', 'eee faculty'], response: "👤 **Dr. V. Anantha Lakshmi** is an Assistant Professor in EEE. Qualification: Ph.D.\n\n![Dr. V. Anantha Lakshmi](https://aliet.ac.in/storage/360/01K9CB95GXHER537GW0P0HWDVQ.jpg)" },
    { keywords: ['gantaiah swamy', 'eee faculty'], response: "👤 **Dr. G. Gantaiah Swamy** is an Assistant Professor in EEE. Qualification: Ph.D.\n\n![Dr. G. Gantaiah Swamy](https://aliet.ac.in/storage/359/01K9CB74RHG2JCZXBM0PZBZKXC.jpg)" },
    { keywords: ['karunakar', 'eee faculty'], response: "👤 **Mr. L. Karunakar** is an Assistant Professor in EEE. Qualification: M.Tech\n\n![Mr. L. Karunakar](https://aliet.ac.in/storage/356/01K9C7JCZVAM83FM5DVWT4FWJY.jpg)" },
    { keywords: ['krishna mohan', 'eee faculty'], response: "👤 **Mr. T. Krishna Mohan** is an Assistant Professor in EEE. Qualification: M.Tech\n\n![Mr. T. Krishna Mohan](https://aliet.ac.in/storage/358/01K9C7KQWMVP5E8DSH6WX67DBH.jpg)" },
    { keywords: ['rama krishna', 'eee faculty'], response: "👤 **Mr. M. Rama Krishna** is an Assistant Professor in EEE. Qualification: M.Tech\n\n![Mr. M. Rama Krishna](https://aliet.ac.in/storage/352/01K9C52JQA1SKR9WKMYF23Z7HR.jpg)" },
    { keywords: ['brahmeswara rao', 'eee faculty'], response: "👤 **Mr. V. Brahmeswara Rao** is an Assistant Professor in EEE. Qualification: M.Tech" },
    { keywords: ['sruthi', 'eee faculty'], response: "👤 **Ms. B. Sruthi** is an Assistant Professor in EEE. Qualification: M.Tech\n\n![Ms. B. Sruthi](https://aliet.ac.in/storage/357/01K9C7K3S0Z822BXE4ZVPST4N3.jpg)" },
    { keywords: ['chandhni srilakshmi', 'eee faculty'], response: "👤 **Ms. A. Chandhni Srilakshmi** is an Assistant Professor in EEE. Qualification: M.Tech\n\n![Ms. A. Chandhni Srilakshmi](https://aliet.ac.in/storage/353/01K9C53SRW9HFGFV10X1QZ6BX4.jpg)" },

    // --- MBA ---
    {
        keywords: ['mba faculty', 'mba department faculty'],
        response: "📚 **Master of Business Administration (MBA) Faculty Members**:\n\n" +
            "1. [Dr. M. Vijay Kumar](send:Dr. M. Vijay Kumar)\n" +
            "2. [Sk. Razia Begum](send:Sk. Razia Begum)\n" +
            "3. [Dr. G. Lalitha Madhavi](send:Dr. G. Lalitha Madhavi)\n" +
            "4. [Dr. K. Sattibabu](send:Dr. K. Sattibabu)\n" +
            "5. [Dr. B. Shanti](send:Dr. B. Shanti)\n" +
            "6. [Dr. M. Indira](send:Dr. M. Indira)\n\n" +
            "Click on any name to view their full profile! ✨"
    },
    { keywords: ['vijay kumar', 'mba hod', 'hod of mba'], response: "🎓 **Dr. M. Vijay Kumar** is the Professor & HOD of MBA. Qualification: Ph.D.\n\n![Dr. M. Vijay Kumar](https://aliet.ac.in/storage/345/01K99PZB38NSA9EXHHRNNH4FGH.jpg)" },
    { keywords: ['razia begum', 'mba faculty'], response: "👤 **Sk. Razia Begum** is an Assistant Professor in MBA. Qualification: MBA, M.Com\n\n![Sk. Razia Begum](https://aliet.ac.in/storage/343/01K99PY7BSR2Y9C0ZCN0SAZF95.jpg)" },
    { keywords: ['lalitha madhavi', 'mba faculty'], response: "👤 **Dr. G. Lalitha Madhavi** is an Assistant Professor in MBA. Qualification: Ph.D.\n\n![Dr. G. Lalitha Madhavi](https://aliet.ac.in/storage/344/01K99PYMYDRRKN1JMVZT66BGNE.jpg)" },
    { keywords: ['sattibabu', 'mba faculty'], response: "👤 **Dr. K. Sattibabu** is an Associate Professor in MBA. Qualification: Ph.D.\n\n![Dr. K. Sattibabu](https://aliet.ac.in/storage/533/01KAX8YYXKN6EJE3EDQ46TH6ND.jpg)" },
    { keywords: ['shanti', 'mba faculty'], response: "👤 **Dr. B. Shanti** is an Assistant Professor in MBA. Qualification: Ph.D.\n\n![Dr. B. Shanti](https://aliet.ac.in/storage/361/01K9CE9E4RF96WGT573SHZSH3N.jpg)" },
    { keywords: ['indira', 'mba faculty'], response: "👤 **Dr. M. Indira** is an Assistant Professor in MBA. Qualification: Ph.D.\n\n![Dr. M. Indira](https://aliet.ac.in/storage/347/01K99QVP5EM564WS1ES5ASJXGP.jpg)" },

    // --- S&H ---
    {
        keywords: ['s&h faculty', 's&h department faculty', 'science and humanities faculty'],
        response: "📚 **Science & Humanities (S&H) Faculty Members**:\n\n" +
            "1. [Dr. Y. Sudhakar](send:Dr. Y. Sudhakar)\n" +
            "2. [Ms. S. P. V. N. D. Sumalatha](send:Ms. S. P. V. N. D. Sumalatha)\n" +
            "3. [Dr. V. V. Prabhakar Rao](send:Dr. V. V. Prabhakar Rao)\n" +
            "4. [Dr. P. Sudha Rani](send:Dr. P. Sudha Rani)\n" +
            "5. [Dr. N. DyvaKrupa](send:Dr. N. DyvaKrupa)\n" +
            "6. [Mr. Y. Rajesh](send:Mr. Y. Rajesh)\n" +
            "7. [Mr. B. Ravi Shankar](send:Mr. B. Ravi Shankar)\n" +
            "8. [Mr. P. Sugandha Kumar](send:Mr. P. Sugandha Kumar)\n" +
            "9. [Ms. B. Sarath Kumari](send:Ms. B. Sarath Kumari)\n" +
            "10. [Mrs. K. Swathi Kiran](send:Mrs. K. Swathi Kiran)\n" +
            "11. [Dr. Sr. Candy D'Cunha](send:Dr. Sr. Candy D'Cunha)\n" +
            "12. [Dr. Ch. Vijaya Lakshmi](send:Dr. Ch. Vijaya Lakshmi)\n" +
            "13. [Mrs. E. Kalavathi](send:Mrs. E. Kalavathi)\n" +
            "14. [Mrs. M. Archana](send:Mrs. M. Archana)\n" +
            "15. [Ms. K. Rajya Lakshmi](send:Ms. K. Rajya Lakshmi)\n" +
            "16. [Dr. T. Kalpana](send:Dr. T. Kalpana)\n" +
            "17. [Mrs. S. Saritha](send:Mrs. S. Saritha)\n" +
            "18. [Mrs. B. Sailaja](send:Mrs. B. Sailaja)\n" +
            "19. [Mr. A. Kalyan Kumar](send:Mr. A. Kalyan Kumar)\n" +
            "20. [Mr. T. Sujith](send:Mr. T. Sujith)\n" +
            "21. [Ms. K. Leela Prasanna](send:Ms. K. Leela Prasanna)\n" +
            "22. [Ms. K. Vasantha Lakshmi](send:Ms. K. Vasantha Lakshmi)\n" +
            "23. [Ms. B. Tripura Sri Satvika](send:Ms. B. Tripura Sri Satvika)\n" +
            "24. [Ms. Parimala Jyothi](send:Ms. Parimala Jyothi)\n" +
            "25. [Mrs. M. Vijaya Lakshmi](send:Mrs. M. Vijaya Lakshmi)\n\n" +
            "Click on any name to view their full profile! ✨"
    },
    { keywords: ['sudhakar', 's&h hod', 'hod of s&h'], response: "🎓 **Dr. Y. Sudhakar** is the Assistant Professor & HOD of Science & Humanities. Qualification: Ph.D.\n\n![Dr. Y. Sudhakar](https://aliet.ac.in/storage/429/01K9VKA818X3JHJR84B2P10TBV.jpg)" },
    { keywords: ['sumalatha', 's&h faculty'], response: "👤 **Ms. S. P. V. N. D. Sumalatha** is an Assistant Professor in S&H. Qualification: M.Sc" },
    { keywords: ['prabhakar rao', 's&h faculty'], response: "👤 **Dr. V. V. Prabhakar Rao** is an Assistant Professor in S&H. Qualification: Ph.D.\n\n![Dr. V. V. Prabhakar Rao](https://aliet.ac.in/storage/368/01K9S3F12XFDMBXWHES8CAJK1S.jpg)" },
    { keywords: ['sudha rani', 's&h faculty'], response: "👤 **Dr. P. Sudha Rani** is an Assistant Professor in S&H. Qualification: Ph.D.\n\n![Dr. P. Sudha Rani](https://aliet.ac.in/storage/339/01K99J536EP7QSWQAB14173FAR.jpg)" },
    { keywords: ['dyvakrupa', 's&h faculty'], response: "👤 **Dr. N. DyvaKrupa** is an Assistant Professor in S&H. Qualification: Ph.D.\n\n![Dr. N. DyvaKrupa](https://aliet.ac.in/storage/370/01K9S3TBAR0Y37H61GTGS747TJ.jpg)" },
    { keywords: ['rajesh', 'physical director'], response: "👤 **Mr. Y. Rajesh** is the Physical Director in S&H. Qualification: M.P.Ed" },
    { keywords: ['ravi shankar', 's&h faculty'], response: "👤 **Mr. B. Ravi Shankar** is an Assistant Professor in S&H. Qualification: M.Sc" },
    { keywords: ['sugandha kumar', 's&h faculty'], response: "👤 **Mr. P. Sugandha Kumar** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mr. P. Sugandha Kumar](https://aliet.ac.in/storage/367/01K9S3CSETCHNSSB7PBTGVT170.jpg)" },
    { keywords: ['sarath kumari', 's&h faculty'], response: "👤 **Ms. B. Sarath Kumari** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. B. Sarath Kumari](https://aliet.ac.in/storage/428/01K9VJX0T8V1DECZCE18V6S9G9.jpg)" },
    { keywords: ['swathi kiran', 's&h faculty'], response: "👤 **Mrs. K. Swathi Kiran** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mrs. K. Swathi Kiran](https://aliet.ac.in/storage/427/01K9VJW8MTTD4X6K35PGR02BZP.jpg)" },
    { keywords: ['candy dcunha', 's&h faculty'], response: "👤 **Dr. Sr. Candy D'Cunha** is an Associate Professor in S&H. Qualification: M.A, M.Phil, Ph.D(DLitt)\n\n![Dr. Sr. Candy D'Cunha](https://aliet.ac.in/storage/369/01K9S3K5KC379SEJ647SHZHZ6T.jpg)" },
    { keywords: ['vijaya lakshmi', 's&h faculty'], response: "👤 **Dr. Ch. Vijaya Lakshmi** is an Assistant Professor in S&H. Qualification: Ph.D.\n\n![Dr. Ch. Vijaya Lakshmi](https://aliet.ac.in/storage/340/01K99JYHHY9M3J2CVX5A142BT1.jpg)" },
    { keywords: ['kalavathi', 's&h faculty'], response: "👤 **Mrs. E. Kalavathi** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mrs. E. Kalavathi](https://aliet.ac.in/storage/366/01K9S3B4ZCR6Y4AP8DRVX0FBMC.jpg)" },
    { keywords: ['archana', 's&h faculty'], response: "👤 **Mrs. M. Archana** is an Assistant Professor in S&H. Qualification: M.Sc" },
    { keywords: ['rajya lakshmi', 's&h faculty'], response: "👤 **Ms. K. Rajya Lakshmi** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. K. Rajya Lakshmi](https://aliet.ac.in/storage/371/01K9S3WMHD1GE1XHCHZT9KW42A.jpg)" },
    { keywords: ['kalpana', 's&h faculty'], response: "👤 **Dr. T. Kalpana** is an Assistant Professor in S&H. Qualification: Ph.D.\n\n![Dr. T. Kalpana](https://aliet.ac.in/storage/437/01K9VM8S5ZGWJV48YTMMYM4BE6.jpg)" },
    { keywords: ['saritha', 's&h faculty'], response: "👤 **Mrs. S. Saritha** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mrs. S. Saritha](https://aliet.ac.in/storage/372/01K9S436KKFKHBE8HVJ9BZ53XR.jpg)" },
    { keywords: ['sailaja', 's&h faculty'], response: "👤 **Mrs. B. Sailaja** is an Assistant Professor in S&H. Qualification: M.Sc" },
    { keywords: ['kalyan kumar', 's&h faculty'], response: "👤 **Mr. A. Kalyan Kumar** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mr. A. Kalyan Kumar](https://aliet.ac.in/storage/430/01K9VKBT4F6BTA8VWF6FYNXB16.jpg)" },
    { keywords: ['sujith', 's&h faculty'], response: "👤 **Mr. T. Sujith** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mr. T. Sujith](https://aliet.ac.in/storage/373/01K9S460AT78JPR33YHFFEEP2Z.jpg)" },
    { keywords: ['leela prasanna', 's&h faculty'], response: "👤 **Ms. K. Leela Prasanna** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. K. Leela Prasanna](https://aliet.ac.in/storage/341/01K99KVQ7R0W0C5R8M8GSZ86JP.jpg)" },
    { keywords: ['vasantha lakshmi', 's&h faculty'], response: "👤 **Ms. K. Vasantha Lakshmi** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. K. Vasantha Lakshmi](https://aliet.ac.in/storage/342/01K99M5THK6WQC5Y2DM75JC1WT.jpg)" },
    { keywords: ['tripura sri satvika', 's&h faculty'], response: "👤 **Ms. B. Tripura Sri Satvika** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. B. Tripura Sri Satvika](https://aliet.ac.in/storage/376/01K9S4JYC25WVP74WV3KMHXZC3.jpg)" },
    { keywords: ['parimala jyothi', 's&h faculty'], response: "👤 **Ms. Parimala Jyothi** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Ms. Parimala Jyothi](https://aliet.ac.in/storage/374/01K9S47GV6JPVVBY69T2B02MRX.jpg)" },
    { keywords: ['vijaya lakshmi m', 's&h faculty'], response: "👤 **Mrs. M. Vijaya Lakshmi** is an Assistant Professor in S&H. Qualification: M.Sc\n\n![Mrs. M. Vijaya Lakshmi](https://aliet.ac.in/storage/375/01K9S4AX5T6MAQSBKJFES66KQE.jpg)" },
    // --- CSE Data Science ---
    {
        keywords: ['CSD faculty', 'cse ds faculty', 'cse data science faculty'],
        response: "📚 **CSE (Data Science) Faculty Members**:\n\n" +
            "1. [Dr. K. Siva Rama Krishna](send:Dr. K. Siva Rama Krishna)\n" +
            "2. [Mr. Y. C. Ashok Kumar](send:Mr. Y. C. Ashok Kumar)\n" +
            "3. [Mrs. P. Nikhitha](send:Mrs. P. Nikhitha)\n" +
            "4. [Mr. B. Rajashekar Reddy](send:Mr. B. Rajashekar Reddy)\n" +
            "5. [Ms. K. Reena](send:Ms. K. Reena)\n" +
            "6. [Ms. M. Mounika Aradhana](send:Ms. M. Mounika Aradhana)\n" +
            "7. [Mrs. V. Munni](send:Mrs. V. Munni)\n" +
            "8. [Mr. MD. Baig Mohammad](send:Mr. MD. Baig Mohammad)\n" +
            "9. [Dr. M. Chinna Rao](send:Dr. M. Chinna Rao)\n" +
            "10. [Ms. M. Beulah Rani](send:Ms. M. Beulah Rani)\n" +
            "11. [Mrs. B. Swathi](send:Mrs. B. Swathi)\n" +
            "12. [Mr. P. Jagadish](send:Mr. P. Jagadish)\n" +
            "13. [Mr. A. Naga Srinivasa Rao](send:Mr. A. Naga Srinivasa Rao)\n" +
            "14. [Ms. S. Prabhavathi](send:Ms. S. Prabhavathi)\n" +
            "15. [Mrs. D. Archana](send:Mrs. D. Archana)\n" +
            "16. [Mr. S. Gopal](send:Mr. S. Gopal)\n" +
            "17. [Mr. M. Winson](send:Mr. M. Winson)\n\n" +
            "Click on any name to view their full profile! ✨"
    },
    { keywords: ['siva rama krishna', 'cse ds faculty'], response: "👤 **Dr. K. Siva Rama Krishna** is an Associate Professor in CSE (Data Science). Qualification: B.Tech, M.Tech, Ph.D. (PDF)\n\n![Dr. K. Siva Rama Krishna](https://aliet.ac.in/storage/147/01K8WW3RXYJZXFASJPPSCTV4HS.png)" },
    { keywords: ['ashok kumar', 'cse ds faculty'], response: "👤 **Mr. Y. C. Ashok Kumar** is an Associate Professor in CSE (Data Science). Qualification: M.Tech, (Ph.D)\n\n![Mr. Y. C. Ashok Kumar](https://aliet.ac.in/storage/148/01K8WW48Y2CME0DJMHXSDH0E24.png)" },
    { keywords: ['nikhitha', 'cse ds faculty'], response: "👤 **Mrs. P. Nikhitha** is an Assistant Professor in CSE (Data Science). Qualification: MS\n\n![Mrs. P. Nikhitha](https://aliet.ac.in/storage/149/01K8WW4PHZBZZN6FJ001R2N6N5.png)" },
    { keywords: ['rajashekar reddy', 'cse ds faculty'], response: "👤 **Mr. B. Rajashekar Reddy** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mr. B. Rajashekar Reddy](https://aliet.ac.in/storage/150/01K8WW540Q74V8FQ5P5FZMB6Z3.png)" },
    { keywords: ['reena', 'cse ds faculty'], response: "👤 **Ms. K. Reena** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Ms. K. Reena](https://aliet.ac.in/storage/151/01K8WW5M3QCW0103ZZ6YVASNZ1.png)" },
    { keywords: ['mounika aradhana', 'cse ds faculty'], response: "👤 **Ms. M. Mounika Aradhana** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Ms. M. Mounika Aradhana](https://aliet.ac.in/storage/152/01K8WW617H1HB6E50H9H6581M0.png)" },
    { keywords: ['munni', 'cse ds faculty'], response: "👤 **Mrs. V. Munni** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mrs. V. Munni](https://aliet.ac.in/storage/153/01K8WW74WFEP2SM0P3DW4MF467.jpg)" },
    { keywords: ['baig mohammad', 'cse ds faculty'], response: "👤 **Mr. MD. Baig Mohammad** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech" },
    { keywords: ['chinna rao', 'cse ds faculty'], response: "👤 **Dr. M. Chinna Rao** is an Associate Professor in CSE (Data Science). Qualification: Ph.D.\n\n![Dr. M. Chinna Rao](https://aliet.ac.in/storage/154/01K8WW7YAQ3GMC39SPF0MJ95RT.png)" },
    { keywords: ['beulah rani', 'cse ds faculty'], response: "👤 **Ms. M. Beulah Rani** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Ms. M. Beulah Rani](https://aliet.ac.in/storage/164/01K8WX1RDZASAHK2NAK4BDT1WP.jpg)" },
    { keywords: ['swathi', 'cse ds faculty'], response: "👤 **Mrs. B. Swathi** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mrs. B. Swathi](https://aliet.ac.in/storage/155/01K8WW8NQPCP4GVG7MV5V5K3Y9.png)" },
    { keywords: ['jagadish', 'cse ds faculty'], response: "👤 **Mr. P. Jagadish** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mr. P. Jagadish](https://aliet.ac.in/storage/156/01K8WW98H9YTRQ2VD9HWNF7GRQ.png)" },
    { keywords: ['naga srinivasa rao', 'cse ds faculty'], response: "👤 **Mr. A. Naga Srinivasa Rao** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mr. A. Naga Srinivasa Rao](https://aliet.ac.in/storage/158/01K8WW9NBG6Y84QY6QH2X8RCTT.png)" },
    { keywords: ['prabhavathi', 'cse ds faculty'], response: "👤 **Ms. S. Prabhavathi** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Ms. S. Prabhavathi](https://aliet.ac.in/storage/159/01K8WWA4WXN7R1MTWWZ7YDFNKP.png)" },
    { keywords: ['archana', 'cse ds faculty'], response: "👤 **Mrs. D. Archana** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mrs. D. Archana](https://aliet.ac.in/storage/160/01K8WWAN1PTQBYJAVX17GZP2WD.png)" },
    { keywords: ['gopal', 'cse ds faculty'], response: "👤 **Mr. S. Gopal** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mr. S. Gopal](https://aliet.ac.in/storage/161/01K8WWB538M97H2GNXEXGFE4YT.png)" },
    { keywords: ['winson', 'cse ds faculty'], response: "👤 **Mr. M. Winson** is an Assistant Professor in CSE (Data Science). Qualification: M.Tech\n\n![Mr. M. Winson](https://aliet.ac.in/storage/162/01K8WWBN9DS8T0MJ3D80MSK2GX.png)" },

    // --- Administration ---
    { keywords: ['director', 'secretary', 'joji reddy'], response: "🎓 **Rev. Fr. Dr. B. Joji Reddy S.J** is the Secretary & Director of ALIET. Qualification: Ph.D.\n\n![Rev. Fr. Dr. B. Joji Reddy S.J](https://aliet.ac.in/storage/blocks/01K8D7DZ0AZSD7TWV75WK07MM0.jpg)" },
    { keywords: ['principal', 'controller of examinations', 'mahesh'], response: "🎓 **Dr. O. Mahesh** is the Principal of ALIET and the Controller of Examinations. Qualification: Ph.D.\n\n![Dr. O. Mahesh](https://aliet.ac.in/storage/blocks/items/01K9C5SX3NDX2A2KERMB1SX07Z.jpg)" },

    // --- Exam Cell ---
    {
        keywords: ['exam cell', 'examination branch', 'exam cell members'],
        response: "📚 **ALIET Examination Cell Members**:\n\n" +
            "1. [Dr. O. Mahesh](send:Dr. O. Mahesh)\n" +
            "2. [Rev. Fr. Dr. S. Emmanuel SJ](send:Rev. Fr. Dr. S. Emmanuel SJ)\n" +
            "3. [Mr. Y. C. Ashok Kumar](send:Mr. Y. C. Ashok Kumar)\n" +
            "4. [Mr. ABDUL AZEEM](send:Mr. ABDUL AZEEM)\n\n" +
            "Click on any name to view their role and profile! ✨"
    },
    { keywords: ['emmanuel', 'director of examinations'], response: "👤 **Rev. Fr. Dr. S. Emmanuel SJ** is the Director of Examinations at ALIET. Qualification: Ph.D.\n\n![Rev. Fr. Dr. S. Emmanuel SJ](https://aliet.ac.in/storage/blocks/items/01K9C53DYWPZA8MP46JN4PEF5C.jpg)" },
    { keywords: ['ashok kumar', 'exam cell'], response: "👤 **Mr. Y. C. Ashok Kumar** is the JNTUK Examination In-charge and Associate Professor in CSE AI&ML. Qualification: M.Tech, (Ph.D)\n\n![Mr. Y. C. Ashok Kumar](https://aliet.ac.in/storage/blocks/items/01K9C599XDES2V40SRR97KD0D3.jpg)" },
    { keywords: ['abdul azeem', 'exam cell'], response: "👤 **Mr. ABDUL AZEEM** is the Autonomous Examination In-charge and Assistant Professor in ECE. Qualification: M.Tech\n\n![Mr. ABDUL AZEEM](https://aliet.ac.in/storage/blocks/items/01K9C5NTDCD78XKVSMKN7R2C8V.jpg)" },
];