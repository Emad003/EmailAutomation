const nodemailer = require("nodemailer");
const csv = require("csv-parser");
const fs = require("fs");

// Gmail account
const accounts = [
{
user: "ksahir103@gmail.com",
pass: "kjxwqlrhizonnyvv"
}
];

// create transporters
const transporters = accounts.map(acc =>
nodemailer.createTransport({
host: "smtp.gmail.com",
port: 465,
secure: true,
auth: {
user: acc.user,
pass: acc.pass
}
})
);

// recipients list
const recipients = [];

// read CSV file
fs.createReadStream(__dirname + "/emails.csv")
.pipe(csv())
.on("data", data => recipients.push(data))
.on("end", () => {
console.log("CSV loaded");
sendBulk();
})
.on("error", err => {
console.log("CSV ERROR:", err);
});

const subject = "Life Time Membership - AMIEE Association of India | 50% Off before 31st January 2026!";

const messageBody = `
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
`;

async function sendBulk(){

console.log("Total emails:", recipients.length);

for(let i = 0; i < recipients.length; i++){

const person = recipients[i];

// rotate account
const transporter = transporters[i % transporters.length];

const htmlBody = `
<div style="font-size:16px;font-family:Arial,sans-serif;line-height:1.6;">
<p>Respected ${person.name},</p>
${messageBody}
</div>
`;

try{

await transporter.sendMail({

from: accounts[i % accounts.length].user,
to: person.email,
cc: "membership@amiee.in",
subject: subject,
html: htmlBody,

attachments:[
{
filename: "logo.jpg",
path: __dirname + "/logo.jpg",
cid: "logo"
}
]

});

console.log("✔ Sent:", person.email);

fs.appendFileSync("success.log", person.email + "\n");

}catch(err){

console.log("❌ Failed:", person.email);
console.log("Error:", err.message);

fs.appendFileSync("failed.log", person.email + " | " + err.message + "\n");

}

}

console.log("All emails processed.");

}