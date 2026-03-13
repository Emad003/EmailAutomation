const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const csv = require("csv-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const upload = multer({ dest: "uploads/" });

let sending = false;

let progress = {
sent: 0,
total: 0
};

let logs = [];

function delay(ms){
return new Promise(resolve => setTimeout(resolve, ms));
}

/* START CAMPAIGN */

app.post("/start", upload.single("csv"), async (req,res)=>{

const email = req.body.email;
const password = req.body.password;
const delaySec = parseInt(req.body.delay);

const file = req.file.path;

const recipients=[];

/* transporter */

const transporter = nodemailer.createTransport({

service:"gmail",

auth:{
user: email,
pass: password
}

});

/* read csv */

fs.createReadStream(file)
.pipe(csv())
.on("data",data=>recipients.push(data))
.on("end",async ()=>{

progress.total = recipients.length;
progress.sent = 0;
logs = [];

sending = true;

for(let i=0;i<recipients.length;i++){

if(!sending) break;

const person = recipients[i];

try{

await transporter.sendMail({

from:`AMIEE Association <${email}>`,
to:person.email,

subject:"Life Time Membership - AMIEE Association of India | 50% Off before 31st January 2026!",

html:`
<div style="font-size:16px;">

<p>Greetings from <strong>Artificial Intelligence and Machine Learning Association </strong>(amiee.in).</p>

<p>We are excited to share with you an incredible opportunity to become a Life Member of the prestigious Association of India (AMIEE) at Rs 1500/- only, an unprecedented 50% discount! This limited-time offer is valid until 31st January 2026, giving you the chance to unlock a world of benefits and opportunities at an unbeatable value.</p>

<p>Simply visit our website 
<a href="https://amiee.in/Individual_Registration.php">
https://amiee.in/Individual_Registration
</a> 
and apply with a discounted fee.</p>

<p><strong>Why Join the AMIEE Association?</strong></p>

<p>The AMIEE Association is a professional organization dedicated to advancing education and research globally, with a particular focus on integrating Artificial Intelligence (AI) and Machine Learning (ML) into our initiatives.In an era where AI and ML dominate the future landscape, and innovation and entrepreneurship are crucial to success, membership in AMIEE provides numerous benefits that can greatly enhance your professional journey.</p>

<p>By becoming a member, you will gain access to a diverse range of benefits that can greatly enhance your professional journey:</p>

<p><strong>Latest Updates on AI and ML</strong>: Stay informed with the most recent advancements in artificial intelligence and machine learning, and learn how to integrate these technologies into your daily life to increase your efficiency tenfold, saving both time and effort.</p>

<p><strong>Complimentary FDPs and Workshops</strong>: Gain access to free Faculty Development Programs and workshops designed to enhance your teaching and professional skills with certificates.</p>

<p><strong>Media Coverage</strong>: Our events are widely covered by media houses which enhances your profile as well.</p>

<p><strong>Resource Person Opportunities</strong>:  Showcase your expertise by becoming a resource person at various educational events, workshops, and FDPs with appreciation certificates.</p>

<p><strong>Leadership Roles</strong>: Take on significant roles such as convenor of FDPs, patron of FDPs, and advisor in programs, contributing to the direction and success of our initiatives with appreciation certificates.</p>

<p><strong>Knowledge Sharing</strong>: Participate in seminars, workshops, and conferences that provide insights into the latest trends and developments in your field.</p>

<p><strong>Professional Development</strong>: Enhance your skills and stay up-to-date with the ever-evolving business landscape through our comprehensive educational resources.</p>

<p><strong>Career Opportunities</strong>: Gain exposure to job openings, internships, and career advancement opportunities through our extensive network.</p>

<p><strong>Networking Opportunities</strong>: Connect with fellow professionals, educators, and industry leaders to expand your professional network and share knowledge.</p>

<p><strong>Exclusive Publications</strong>: Receive access to cutting-edge research, articles, and publications that can enrich your understanding of commerce and management.</p>

<p><strong>Membership Offer Details:</strong></p>

<p>Take advantage of this limited-time offer and secure your AMIEE membership at a 50% discount on all membership tiers. Simply visit our website <a href="https://amiee.in/Individual_Registration">https://amiee.in/Individual_Registration </a> and apply with a discounted fee. Don't miss out on this opportunity to elevate your professional journey and make a lasting impact in your industry.</p>

<h3>Act Now:</h3>

<p>The clock is ticking, this offer is valid only until 31st January. Seize this chance to become a part of the thriving AMIEE community and enjoy unparalleled benefits that will shape your career for years to come</p>

<p>Visit <a href="https://amiee.in">https://amiee.in</a> to join the AMIEE Association today.</p>

<p>For any queries or assistance, feel free to reach out to our dedicated support team</p>

<p>We also invite your esteemed department to start a <b>Students Chapter of AMIEE.</b> By doing so, your institution can host academic events, receive media coverage, and connect your students with leading experts in AI and ML. Please call 9939802016 for any queries</p>

<p>Thank you for considering this exclusive offer. We look forward to welcoming you into the AMIEE family and embarking on a journey of growth and success together</p>


<p><b>Note: Please ignore this email if you are already a Lifetime Member.</b></p>

<p>
Warm regards,<br>
Dr. Aamir Junaid Ahmad<br>
Secretary, AMIEE Association<br>
<b>TEDx Speaker | Times Excellence 2021 | Mentioned in FORBES</b>
</p>

<img src="cid:logo" style="width:500px;height:193px;margin-top:10px;">

</div>
`,

attachments:[
{
filename:"logo.jpg",
path:"./logo.jpg",
cid:"logo"
}
]

});

progress.sent++;

logs.push({
email: person.email,
status: "success"
});

console.log("✔ Sent:",person.email);

}catch(err){

logs.push({
email: person.email,
status: "failed"
});

console.log("❌ Failed:", person.email);
console.log("Error:", err.message);

}

await delay(delaySec * 1000);

}

fs.unlinkSync(file);

});

res.json({status:"Campaign Started"});

});

/* STOP CAMPAIGN */

app.post("/stop",(req,res)=>{

sending=false;

res.json({
status:"Campaign Stopped"
});

});

/* PROGRESS API */

app.get("/progress",(req,res)=>{

res.json(progress);

});

/* LOGS API */

app.get("/logs",(req,res)=>{

res.json(logs);

});

/* START SERVER */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`🚀 Bulk Mail Server Running on port ${PORT}`);
});