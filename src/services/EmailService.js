const nodemailer = require("nodemailer");
require('dotenv').config();

const sendEmailCreateOrder = async (email, orderItems) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for port 465, false for other ports
        auth: {
            user: process.env.MAIL_ACCOUNT,
            pass: process.env.MAIL_PASSWORD,
        },
    });

    let orderItemsHtml = '';
    const attachImage = [];

    orderItems.forEach(item => {
        orderItemsHtml += `<div key=${item.product}>
            <img src="${item.image}" alt="product image" /> <p>Tên sản phẩm: ${item.name}</p>
            <p>Số lượng: ${item.amount}</p>
            <p>Giá: ${item.price}</p>
        </div>`;
        attachImage.push({ path: item.image });
    });

    const info = await transporter.sendMail({
        from: process.env.MAIL_ACCOUNT, // sender address
        to: email, // list of receivers
        subject: "Bạn đã đặt hàng thành công tại Shop Đồ Nội Thất", // Subject line
        text: `Bạn đã đặt hàng thành công tại Shop Đồ Nội Thất.
        Danh sách sản phẩm bạn đã đặt:

        ${orderItems.map(item =>
            `- Tên sản phẩm: ${item.name}, Số lượng: ${item.amount}, Giá: ${item.price}`
        ).join('\n')}

        Cảm ơn bạn đã mua sắm tại Shop Đồ Nội Thất!`, // plain text body
        html: `<div><b>Bạn đã đặt hàng thành công tại Shop Đồ Nội Thất</b></div>

        ${orderItemsHtml}

        Cảm ơn bạn đã mua sắm tại Shop Đồ Nội Thất!`, // html body
        attachments: attachImage
    });
}

module.exports = {
    sendEmailCreateOrder
}