const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'your-email@gmail.com', 
        pass: 'your-email-password',  
    },
});

const mailOptions = {
    from: 'your-email@gmail.com',
    to: email,
    subject: 'Your Account Password',
    text: `Dear ${Name},\n\nYour account has been created successfully. Here is your password: ${password}\n\nPlease log in and change your password immediately.\n\nBest regards,\nYour Company`,
};