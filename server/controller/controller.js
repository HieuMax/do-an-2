const { json } = require('express');
const pool = require('../database/database')
const path = require('path');
const { createTopic, createGroupConsumer, checkExistConsumer, createMsg } = require('./notifyController');
const { error } = require('console');



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
    const { hoidongid } = req.params; 
  
    try {

      await pool.query('BEGIN');
  
      await pool.query('DELETE FROM thanhvienhd WHERE hoidongid = $1', [hoidongid]);
  
      const result = await pool.query('DELETE FROM hoidong WHERE hoidongid = $1 RETURNING *', [hoidongid]);
  
      if (result.rowCount === 0) {
        await pool.query('ROLLBACK'); 
        res.json({ success: false, message: 'Hội đồng không tồn tại' });

      }
  
      await pool.query('COMMIT');
      res.json({ success: true, message: 'Hội đồng và các thành viên đã được xóa thành công' });
  
    } catch (error) {
      console.error('Lỗi khi xóa hội đồng:', error);
      await pool.query('ROLLBACK'); 
      res.json({ success: false, message: 'Lỗi hệ thống' });

    }
  };


  const addNewTeacher = async (giangvienid, hoten, hocham, hocvi, mail, tennh, stknh, cccd, gioitinh, ngaysinh, khoaid, sdt,imageUrl) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

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

  const updateTeacher = async (
    id, hoten, hocham, hocvi, ngaysinh, gioitinh, khoaid, tennh, mail, sdt, stknh, cccd, imageUrl
  ) => {
    try {
      let query = `
        UPDATE giangvien
        SET hoten = $1, hocham = $2, hocvi = $3, ngaysinh = $4, gioitinh = $5, khoaid = $6, tennh = $7, mail = $8, sdt = $9, stknh = $10, cccd = $11
      `;
      
      const values = [hoten, hocham, hocvi, ngaysinh, gioitinh, khoaid, tennh, mail, sdt, stknh, cccd, id];
      
      if (imageUrl !== null) {
        query += `, avtimg = $12`;
        values.splice(11, 0, imageUrl);  // Thêm `imageUrl` vào vị trí $12
      }
  
      query += ` WHERE giangvienid = $${values.length} RETURNING *;`;
  
      const result = await pool.query(query, values);
  
      if (result.rows.length === 0) {
        return { error: "lỗi" };
      }
  
      return { giangvienid: id };
    } catch (error) {
      console.error('Error updating teacher:', error);
      return { error: "lỗi" };
    }
  };
  
  const uploadTeacherList = async (req, res) => {
    const { data } = req.body;
  
    try {

      const values = data.map((teacher) => [
        teacher.giangvienid,
        teacher.hoten,
        teacher.hocham,
        teacher.hocvi,
        teacher.ngaysinh,
        teacher.gioitinh,
        teacher.khoaid,
        teacher.tennh,
        teacher.mail,
        teacher.sdt,
        teacher.stknh,
        teacher.cccd,
      ]);

      
      const query = `
        INSERT INTO giangvien (giangvienid, hoten, hocham, hocvi, ngaysinh, gioitinh, khoaid, tennh, mail, sdt, stknh, cccd)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `;
  
      // Chạy một vòng lặp cho mỗi giảng viên để thêm từng người vào DB
      for (let i = 0; i < values.length; i++) {
        await pool.query(query, values[i]);
      }
  
      res.json({ success: true, message: 'Thêm danh sách giảng viên thành công!' });
    } catch (error) {
      // console.error('Lỗi khi thêm danh sách giảng viên:', error);
      // res.status(500).json({ success: false, error: 'Lỗi server!' });
      res.json({ success: false, message: 'Thêm danh sách giảng viên thất bại!' });

    }
  };

  const deleteTeacher = async (req, res) => {
    const { id } = req.params;
    
    try {
      const result = await pool.query('DELETE FROM giangvien WHERE giangvienid = $1 RETURNING *', [id]);
  
      if (result.rowCount === 0) {
        res.json({ success: false, message: 'Không tìm thấy giảng viên' });

      }
  
      res.json({ success: true, message: 'Xóa giảng viên thành công' });
    } catch (error) {
      res.json({ success: false, message: 'Lỗi hệ thống' });

    }
  };

  const getProjectsByStatus = async (req, res) => {
    try {
        const query = `
            SELECT * FROM detai
            WHERE trangthai between $1 and $2
        `;
        const values = [1, 7]; 

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.json({ success: false, message: 'Không tìm thấy đề tài nào với trạng thái 1 hoặc 2' });
        }

        return res.json({ success: true, data: result.rows});
        
    } catch (error) {
        console.error('Lỗi khi lấy đề tài:', error);
        res.status(500).json({ message: 'Lỗi hệ thống' });
    }
  };

  const updateProjectStatusAndCouncil = async (detaiid, trangthai, hoidongphancong) => {
      try {
      const checkQuery = `SELECT * FROM diemtailieudexuat WHERE detaiid = $1`;
      const checkResult = await pool.query(checkQuery, [detaiid]);

      if (checkResult.rowCount > 0) {
        return { success: false, message: 'Đề tài không được thay đổi' };
      }
      
      const query = `
        UPDATE detai
        SET trangthai = $1, hoidongphancong = $2
        WHERE detaiid = $3
        RETURNING *;
      `;
      const values = [trangthai, hoidongphancong, detaiid];
  
      const result = await pool.query(query, values);
      
      if (result.rowCount === 0) {
        return { success: false, message: 'Đề tài không tồn tại' };
      }
  
      return { success: true, message: 'Cập nhật thành công', data: result.rows[0] };
    } catch (error) {
      console.error('Lỗi khi cập nhật đề tài:', error);
      return { success: false, message: 'Lỗi hệ thống' };
    }
  };

  const checkCouncilAssigned = async (req, res) => {
    const {hoidongid} = req.params;
    try {
        const query = "SELECT hoidongphancong FROM detai WHERE hoidongphancong = $1";

        const results = await pool.query(query, [hoidongid]);
        if (results.rows.length > 0) {
            return res.json({ assigned: true });
        } else {
            return res.json({ assigned: false });
        }
    } catch (err) {
        return res.json({ error: err.message });
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
        case 'departments':
            return getAllFromDb('khoa');
        case 'classes':
            return getAllFromDb('lop');
        default: 
            return
    }
}
const getAccessProject = async (uid, typeOfUser) => {
    // const user = 
    let query = '';
    if (typeOfUser == 'Student') {
        query = `SELECT * FROM detai WHERE sinhvienid = $1`
        const results = await pool.query(query, [uid]);
        return {"data": results.rows};
    } 
    // else if (typeOfUser == 'Teacher') {
        query = `SELECT DISTINCT * 
        FROM detai 
        INNER JOIN hoidong ON hoidong.hoidongid = detai.hoidongphancong
        WHERE giangvienchunhiemid = $1 OR detai.hoidongphancong IN (SELECT DISTINCT hoidongid FROM thanhvienhd WHERE giangvienid = $2)
        GROUP BY detai.detaiid, hoidong.hoidongid`
    // }
    const results = await pool.query(query, [uid, uid]);
    // console.log(results)
    return {"data": results.rows};

}

const getAllFromDb = async (name) => {
    // prevent SQL injection
    const allowedTables = ['sinhvien', 'giangvien', 'detai','hoidong','khoa','lop'];
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
        case 'departments':
            return getDepartmentById(id);
        case 'classes':
            return getClassById(id);
        case 'councils':
            return getCouncilById(id);
        case 'student-Byaccount':
            return getStudentIdByAccountId(id);
        case 'mentor-Byaccount':
            return getMentorIdByAccountId(id);
        case 'admin-Byaccount':
            return getAdminIdByAccountId(id);
        default: 
            return
    }
}

// Get userId
const getStudentIdByAccountId = async (id) => {
    const query = "SELECT * FROM sinhvien WHERE taikhoanid = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}

const getMentorIdByAccountId = async (id) => {
    const query = "SELECT * FROM giangvien WHERE taikhoanid = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}

const getAdminIdByAccountId = async (id) => {
    const query = "SELECT * FROM bophanql WHERE taikhoanid = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}



const getByKeyObject = (table, key, obj) => {
    switch (table) {
        case "mentors": 
            return getMentorByQuery(key, obj)
        default: 
            return
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
    // const query = "SELECT * FROM detai WHERE detaiid = $1"
    const query = `
    SELECT *
    FROM detai 
    INNER JOIN sinhvien ON sinhvien.sinhvienid = detai.sinhvienid
    WHERE detaiid = $1`
    const member = await getMemberOfProject(id);
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0], "members": member};
    } catch (err) {
        return {"error": err.message};
    }
}
const getCouncilById = async(id) => {
    const query = "SELECT * FROM hoidong WHERE hoidongid = $1"
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

const getMentorByQuery = async(key, obj) => {
    const allowedTables = ['khoaid'];
    if (!allowedTables.includes(key)) {
        return json({"error": "Invalid table name"});
    }
    const query = `SELECT * FROM giangvien WHERE ${key} = $1`
    try {
        const results = await pool.query(query, [obj]);
        return {"data": results.rows};
    } catch (err) {
        return {"error": err.message};
    }
}

const getDepartmentById = async(id) => {
    const query = "SELECT * FROM khoa WHERE khoaid = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}
const getClassById = async(id) => {
    const query = "SELECT * FROM lop WHERE lopid = $1"
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows[0]};
    } catch (err) {
        return {"error": err.message};
    }
}

const getMemberOfProject = async(id) => {
    const query = `
    SELECT sinhvien.sinhvienid, sinhvien.hoten
    FROM thanhvienthuchien 
    INNER JOIN sinhvien ON sinhvien.sinhvienid = thanhvienthuchien.sinhvienid
    WHERE detaiid = $1 `
    try {
        const results = await pool.query(query, [id]);
        return {"data": results.rows};
    } catch (err) {
        return {"error": err.message};
    }
}

const getLastIdProject = async () => {
    try {
        const results = await pool.query("SELECT detaiid FROM detai ORDER BY detaiid DESC LIMIT 1")
        return { "data": results.rows[0] }
    } catch (error) {
        return { "error": error.message }
    }
}

const getMarkOfProject = async(detaiid, role, userid, type) => {
    if(type == "dexuat") {
        if (role == "nguoichamdiem") {
            const queryMarked = `SELECT * FROM diemtailieudexuat WHERE detaiid = $1`
            const resultMarked = await pool.query(queryMarked, [detaiid])
            if (resultMarked.rowCount == 5) {
                return { "data": resultMarked.rows }
            }
            const query = `SELECT * FROM diemtailieudexuat WHERE detaiid = $1 AND nguoichamdiem = $2`
            const result = await pool.query(query, [detaiid, userid])
            // console.log(result)
            return { "data": result.rows }
            
        } else if(role == "sinhvien") {
            const query = `SELECT * FROM diemtailieudexuat WHERE detaiid = $1`
            const result = await pool.query(query, [detaiid])
            return { "data": result.rows }
    
        }
    } else if (type == "thuyetminh") {
        if (role == "nguoichamdiem") {
            const query = `SELECT * FROM diemtailieuthuyetminh WHERE detaiid = $1 AND nguoichamdiem = $2`
            const result = await pool.query(query, [detaiid, userid])
            // console.log(result)
            return { "data": result.rows }
            
        } else if(role == "sinhvien") {
            const query = `SELECT * FROM diemtailieuthuyetminh WHERE detaiid = $1`
            const result = await pool.query(query, [detaiid])
            return { "data": result.rows }
    
        }
    }
}

const getProposalFile = async(detaiid) => {
    const query = `SELECT * FROM tailieuthuyetminh WHERE detaiid = $1`
    const result = await pool.query(query, [detaiid])
    return { data: result.rows[0] }
}

const getTopicById = async(id) => {
    const query = 'SELECT id FROM topics WHERE detaiid = $1'
    const result = await pool.query(query, [id])
    return { data: result.rows[0] }
}

const getRelatedToAccess = async (detaiid, uid) => {
    const query = `SELECT detaiid FROM detai 
    WHERE detaiid = $1
    AND (sinhvienid = $2
    OR giangvienchunhiemid = $3
    OR hoidongphancong IN (SELECT hoidongid FROM thanhvienhd WHERE giangvienid = $4))`
    const res = await pool.query(query, [detaiid, uid, uid, uid])
    if (res.error) return { error: res.error }
    if (res.rowCount > 0) {
        // console.log("allowed")

        return { permission: "allowed", accessedProject: res.rows }
    }
    // console.log("not allowed")
    return { permission: "Not allowed" }
}

// ---------------------------------------------------------------------------
// PUT -----------------------------------------------------------------------
// ---------------------------------------------------------------------------


const updateStatus = async (status, id, uid) => {
    const query = `UPDATE detai SET trangthai = $1 WHERE detaiid = $2`
    try {
        await pool.query(query, [status, id]);
        // console.log(status)
        if (status == 1) {
            const msg = `Đề tài ${id} đã được giảng viên hướng dẫn phê duyệt`
            const topicId = await getTopicById(id)
            // console.log(uid)
            // console.log(topicId.data.id)
            await createMsg(uid, topicId.data.id, msg, Date.now(), "giangvien") // Mentor sent - so get type of mentor
            // console.log('ok')

            // const groupid = await createGroupConsumer(`PCHD${String(id).substring(2)}`, `Phân công hội đồng cho đề tài ${id}`)
            const sendMessToAdmin = async () => {
                const groupid = 'BQL';
                const topicId = await createTopic("Phân công hội đồng", groupid, id) // Create topic for groupConsumer subcribe

                const msg = `Đề tài ${id} đã được giảng viên hướng dẫn phê duyệt, yêu cầu phân công hội đồng phụ trách đề tài.`

                await createMsg(uid, topicId.id, msg, Date.now(), "giangvien") // Student sent - so get type of student
            }
            sendMessToAdmin();
        }

        return {"status": 200, message: "Updated successfully"};
    } catch (err) {
        return {"error": err.message}        
    }
}

const updateFile = async (type, id, file) => {
    const allowedTypes = ['tailieudexuat']
    if (!allowedTypes.includes(type)) {
        return json({"error": "Invalid type name"});
    }
    switch(type){
        case "tailieudexuat":
            const query = `UPDATE detai SET tailieudexuat = $1 WHERE detaiid = $2`
            try {
                await pool.query(query, [file, id]);
                return {"status": 200, message: "Updated successfully"};
            } catch (err) {
                return {"error": err.message}        
            }
        default:
            return
    }
}

// ---------------------------------------------------------------------------
// POST ----------------------------------------------------------------------
// ---------------------------------------------------------------------------

const registNewProject = async (data) => {
    const columns = Object.keys(data)
    columns.splice(columns.indexOf("thanhVienThucHien"), 1)
    columns.join(', ')
    const valuesArray = Object.values(data);
    const memList = valuesArray.splice(5, 1)[0]
    const detaiId = data.detaiid
    const text = `INSERT INTO detai (${columns}) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
    const query = {
        text: text,
        values: valuesArray
    }
    // try {
        const result = await pool.query(query)
        if(result.error) {
            throw result.error
        }
        for(let mem of memList) {
            const query_memList = `INSERT INTO thanhvienthuchien (detaiid, sinhvienid) VALUES ($1, $2)`
            const result_memList = await pool.query(query_memList, [detaiId, mem.sinhvienid])
            // console.log(mem)
            if(result_memList.error) {
                throw result_memList.error
            }
        }
        // console.log('here')

        // Ham create thong bao
        const groupid = await createGroupConsumer(`HD${String(detaiId).substring(2)}`, `Giảng viên hướng dẫn đề tài ${detaiId}`)
        // console.log(groupid)
        if(groupid) {
            const topicId = await createTopic("Phê duyệt đề tài", groupid, detaiId) // Create topic for groupConsumer subcribe
            await checkExistConsumer(valuesArray[4], groupid, "giangvien") // Assign mentor to groupConsumer
            await checkExistConsumer(valuesArray[5], groupid, "sinhvien") // Assign student to groupConsumer
            const student = await getById('students', valuesArray[5])
            const msg = "Sinh viên " + student.data.hoten + " đã đăng ký đề tài " + valuesArray[0] + ", yêu cầu phê duyệt đề tài."
            await createMsg(valuesArray[5], topicId.id, msg, Date.now(), "sinhvien") // Student sent - so get type of student
        }
        return { status: 201 }
}

const uploadProposal = async (data) => {
    try {
        const values = Object.values(data)
        const text = `INSERT INTO tailieuthuyetminh (tailieupath, detaiid, ngaynop, originalfilename) VALUES ($1, $2, $3, $4)`
        const query = {
            text: text,
            values: values
        }
        const result = await pool.query(query)
        if(result.error) {
            throw result.error
        }
        return { status: 201 }
    } catch (error) {
        return {"error": error.message}
    }
}

const permission = async(token, detaiid) => {
    const a = await pool.query(`SELECT hoidongphancong FROM detai WHERE detaiid = $1`, [detaiid])
    const hoidongid = await a.rows[0].hoidongphancong;
    const b = await pool.query('SELECT * FROM thanhvienhd WHERE hoidongid = $1 AND giangvienid = $2', [hoidongid, token])
    if(b.rows[0]) {
        return true
    }
    return false
}

const markProject = async(type, data) => {
    const allowedTables = ["diemtailieuthuyetminh", "diemtailieudexuat"]
    if(!allowedTables.includes(type)) {
        return json({ status: 500, message: "Invalid server" })
    }
    const permis = await permission(data.nguoichamdiem, data.detaiid)
    if(!permis) {
        return { "Error": "Not permission" }
    } else {
        let query;
        if (type == allowedTables[0]) {
            query = `INSERT INTO diemtailieuthuyetminh (nguoichamdiem, diemtailieu, nhanxet, detaiid, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6, diemtc7, diemtc8) VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
        } else if (type == allowedTables[1]) {
            query = `INSERT INTO diemtailieudexuat (nguoichamdiem, diemtailieu, nhanxet, detaiid, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6, diemtc7, diemtc8) VALUES 
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`
        }
        try {
            const result = await pool.query(query, [data.nguoichamdiem, data.mark, data.comment, data.detaiid, data.diemtc1, data.diemtc2, data.diemtc3, data.diemtc4, data.diemtc5, data.diemtc6, data.diemtc7, data.diemtc8])
            if(result.error) {
                throw result.error
            }
            return { status: 201 }

        } catch (error) {
            return { "error": error }
        }
    }
}

const markType = (type, data) => {
    switch(type){
        case "ThuyetMinh":
            return markProject("diemtailieuthuyetminh", data)
        case "DeXuat":
            return markProject("diemtailieudexuat", data)
        default: 
            return
    }
}

//
// DOWNLOAD --------------------------------
//
const downloadFile = (req) => {
    const filepath = path.join(__dirname, "../")
    return path.join(filepath, 'files-upload', req)
}


module.exports = {
    getAll,
    getById,
    addCouncilWithMembers,
    getCouncilMembers,
    deleteCouncil,
    updateCouncilMember,
    addNewTeacher,
    updateTeacher,
    uploadTeacherList,
    deleteTeacher,
    getProjectsByStatus,
    getByKeyObject,
    updateStatus,
    getLastIdProject,
    registNewProject,
    updateFile,
    downloadFile,
    markType,
    getMarkOfProject,
    uploadProposal,
    getProposalFile,
    updateProjectStatusAndCouncil,
    getAccessProject,
    getRelatedToAccess,
    checkCouncilAssigned
}