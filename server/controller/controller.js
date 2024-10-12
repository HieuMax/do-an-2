const { json } = require('express');
const pool = require('../database/database')



const addCouncilWithMembers = async (hoidongid, tenhoidong, mota, thanhvien) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Thêm hội đồng mới với hoidongid từ middleware
        const insertCouncilQuery = "INSERT INTO hoidong (hoidongid, tenhoidong, mota) VALUES ($1, $2, $3)";
        await client.query(insertCouncilQuery, [hoidongid, tenhoidong, mota]);

        // Thêm thành viên hội đồng
        const insertMemberQuery = "INSERT INTO thanhvienhd (hoidongid, giangvienid, vaitro) VALUES ($1, $2, $3)";
        for (const member of thanhvien) {
            await client.query(insertMemberQuery, [hoidongid, member.giangvienid, member.vaitro]);
        }

        await client.query('COMMIT');
        return { "hoidongid": hoidongid };
    } catch (err) {
        await client.query('ROLLBACK');
        return { "error": err.message };
    } finally {
        client.release();
    }
};

const getCouncilMembers = async (req, res) => {
    const { hoidongid } = req.params;
  
    try {
      const result = await pool.query(
        `SELECT thanhvienhd.giangvienid, thanhvienhd.vaitro, giangvien.hoten
         FROM thanhvienhd
         JOIN giangvien ON thanhvienhd.giangvienid = giangvien.giangvienid
         WHERE thanhvienhd.hoidongid = $1`,
        [hoidongid]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Council not found' });
      }
  
      // Tạo đối tượng lưu các thành viên theo vai trò
      const councilMembers = {
        chuTich: null,
        chuTichID: null,
        thuKy: null,
        thuKyID: null,
        uyVien: null,
        uyVienID: null,
        phanBien1: null,
        phanBien1ID: null,
        phanBien2: null,
        phanBien2ID: null,

      };
  
      // Duyệt qua các thành viên và phân loại theo vai trò
      result.rows.forEach(member => {

        switch (member.vaitro) {
          case 'Chủ tịch':
            councilMembers.chuTich = member.hoten;
            councilMembers.chuTichID = member.giangvienid;
            break;
          case 'Thư ký':
            councilMembers.thuKy = member.hoten;
            councilMembers.thuKyID = member.giangvienid;
            break;
          case 'Ủy viên':
            councilMembers.uyVien= member.hoten;
            councilMembers.uyVienID = member.giangvienid;
            break;
          case 'Phản biện 1':
            councilMembers.phanBien1 = member.hoten;
            councilMembers.phanBien1ID = member.giangvienid;
            break;
          case 'Phản biện 2':
            councilMembers.phanBien2 = member.hoten;
            councilMembers.phanBien2ID = member.giangvienid;
            break;
          default:
            break;
        }
      });
      res.json(councilMembers);
    } catch (error) {
      console.error('Error fetching council members:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const updateCouncilMember = async (req, res) => {
    const { hoidongid, giangvienid, vaitro } = req.body;
  
    if (!hoidongid || !giangvienid || !vaitro) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
  
    try {
      const query = `
        UPDATE thanhvienhd
        SET giangvienid = $2
        WHERE hoidongid = $1 AND vaitro = $3
      `;
      const values = [hoidongid, giangvienid, vaitro];
  
      const result = await pool.query(query, values);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'Council member not found' });
      }
  
      res.status(200).json({ success: true, message: 'Council member updated successfully' });
    } catch (error) {
      console.error('Error updating council member:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };
  

  const deleteCouncil = async (req, res) => {
    const { hoidongid } = req.params; // Lấy hoidongid từ URL params
  
    try {
      // Bắt đầu giao dịch
      await pool.query('BEGIN');
  
      // Xóa tất cả thành viên trong hội đồng
      await pool.query('DELETE FROM thanhvienhd WHERE hoidongid = $1', [hoidongid]);
  
      // Xóa hội đồng
      const result = await pool.query('DELETE FROM hoidong WHERE hoidongid = $1 RETURNING *', [hoidongid]);
  
      // Kiểm tra xem hội đồng có được xóa không
      if (result.rowCount === 0) {
        await pool.query('ROLLBACK'); // Nếu không có hội đồng nào bị xóa, rollback
        return res.status(404).json({ message: 'Hội đồng không tồn tại' });
      }
  
      // Commit giao dịch
      await pool.query('COMMIT');
  
      // Trả về phản hồi thành công
      res.status(200).json({ message: 'Hội đồng và các thành viên đã được xóa thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa hội đồng:', error);
      await pool.query('ROLLBACK'); // Rollback nếu có lỗi xảy ra
      res.status(500).json({ message: 'Lỗi máy chủ' });
    }
  };


  const addNewTeacher = async (giangvienid, hoten, hocham, hocvi, mail, tennh, stknh, cccd, gioitinh, ngaysinh, khoaid, sdt,imageUrl) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // const image1 = req.files.image1 && req.files.image1[0]

        // if (avtImage) {
        //     let result = await cloudinary.uploader.upload(avtImage.path, { resource_type: 'image' });
        //     let imageUrl = result.secure_url;
        //     console.log("Uploaded image URL:", imageUrl);
        // } else {
        //     console.log("No image provided");
        // }


        // Thêm hội đồng mới với hoidongid từ middleware
        const insertCouncilQuery = "INSERT INTO giangvien (giangvienid, hoten, hocham, hocvi, mail, tennh, stknh, cccd, gioitinh, ngaysinh, khoaid, sdt, avtimg) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
        await client.query(insertCouncilQuery, [giangvienid, hoten, hocham, hocvi, mail, tennh, stknh, cccd, gioitinh, ngaysinh, khoaid, sdt, imageUrl]);

        await client.query('COMMIT');
        return { "giangvienid": giangvienid };
    } catch (err) {
        await client.query('ROLLBACK');
        return { "error": err.message };
    } finally {
        client.release();
    }
  };


// ------------------------------------
const getAll = (name) => {
    switch (name) {
        case 'students':
            return getAllFromDb('sinhvien');
        case 'mentors':
            return getAllFromDb('giangvien');
        case 'projects':
            return getAllFromDb('detai');
        case 'councils':
            return getAllFromDb('hoidong');
        case 'departments':
            return getAllFromDb('khoa');    
    }
}

const getAllFromDb = async (name) => {
    // prevent SQL injection
    const allowedTables = ['sinhvien', 'giangvien', 'detai','hoidong','khoa'];
    if (!allowedTables.includes(name)) {
        return json({"error": "Invalid table name"});
    }

    const query = `SELECT * FROM ${name}`;
    
    try {
        const results = await pool.query(query);
        return {"data": results.rows};
    } catch (err) {
        return {"error": err.message};
    }
};

const getById = (obj, id) => {
    switch (obj) {
        case 'students':
            return getStudentById(id);
        case 'mentors':
            return getMentorById(id);
        case 'projects':
            return getProjectById(id);
    }
}

const getStudentById = async(id) => {
    const query = "SELECT * FROM sinhvien WHERE sinhVienID = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}
const getProjectById = async(id) => {
    const query = "SELECT * FROM detai WHERE detaiid = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}
const getMentorById = async(id) => {
    const query = "SELECT * FROM giangvien WHERE giangvienid = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}


module.exports = {
    getAll,
    getById,
    addCouncilWithMembers,
    getCouncilMembers,
    deleteCouncil,
    updateCouncilMember,
    addNewTeacher
}