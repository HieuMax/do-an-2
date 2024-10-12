const pool = require('../database/database'); // Kết nối tới PostgreSQL

const generateTeacherId = async (req, res, next) => {
    try {
        const query = 'SELECT giangvienid FROM giangvien ORDER BY giangvienid DESC LIMIT 1';
        const result = await pool.query(query);
        
        
        let newId;
        if (result.rows.length > 0) {
            const lastId = result.rows[0].giangvienid;
            const numericPart = parseInt(lastId.slice(2)) + 1; // Lấy phần số và tăng lên 1
            newId = `GV${numericPart.toString().padStart(3, '0')}`; // Tạo ID mới dạng HD001, HD002, ...
        } else {
            newId = 'GV001'; // Nếu chưa có hội đồng nào, bắt đầu từ HD001
        }

        req.body.giangvienid = newId; // Gán ID mới vào req.body
        next(); // Gọi next để tiếp tục xử lý middleware tiếp theo
    } catch (err) {
        res.status(500).json({ "error": "Lỗi khi tạo ID hội đồng" });
    }
};

module.exports = { generateTeacherId };
