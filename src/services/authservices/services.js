const crypto=require("crypto")
const nodemailer=require("nodemailer")

function generateRandomPassword() {
    return crypto.randomBytes(4).toString('hex');
}
module.exports=generateRandomPassword

async function sendPasswordEmail(Name, email, password) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'govindupadhyay85273@gmail.com',
                pass: 'pwbc jxzf cpfj grqj',
            },
        });

        const mailOptions = {
            from: 'govindupadhyay85273@gmail.com',
            to: email,
            subject: 'Your Account Password',
            text: `Dear ${Name},\n\nYour account has been created successfully. Here is your password: ${password}\n\nPlease log in and change your password immediately.\n\nBest regards,\nYour Company`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
module.exports={generateRandomPassword,sendPasswordEmail}