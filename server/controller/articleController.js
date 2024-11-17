const cloudinary = require('cloudinary').v2;
const pool = require('../database/database')
const { getAll } = require('../controller/controller')

const uploadSingleImage = async (req, res) => {
    try {
        let imageUrl = null;

        // Kiểm tra nếu có tệp được tải lên và tải tệp lên Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, { 
                resource_type: 'image',
                folder: 'bai_viet'
            });
            imageUrl = result.secure_url;
        }

        
        return res.json({data: imageUrl});
       

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const getAllArticle = async (req, res) => {

    const result = await getAll("articles");

    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({baiviet: result.data})
    }
    
};
const getArticleBySlug = async (req, res) => {

  try {
    const { slug } = req.params; // Nhận dữ liệu từ request body


    const checkQuery = `
    SELECT * FROM baiviet 
    WHERE slug = $1
    `;
    const checkResult = await pool.query(checkQuery, [slug]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
    }
    
    // Thực hiện truy vấn SQL để lưu bài viết vào cơ sở dữ liệu
    const query = `
    SELECT * FROM baiviet 
    WHERE slug = $1;
    `;

    const values = [slug];

    // Thực thi câu lệnh SQL
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Lỗi' });
    }
    const article = result.rows[0];
    res.json({success: true, data: article})
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
};

const getArticleById = async (req, res) => {

  try {
    const { id } = req.params; // Nhận dữ liệu từ request body


    const checkQuery = `
    SELECT * FROM baiviet 
    WHERE id = $1
    `;
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
    }
    
    // Thực hiện truy vấn SQL để lưu bài viết vào cơ sở dữ liệu
    const query = `
    SELECT * FROM baiviet 
    WHERE id = $1;
    `;

    const values = [id];

    // Thực thi câu lệnh SQL
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Lỗi' });
    }
    const article = result.rows[0];
    res.json({success: true, data: article})
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
};

const deleteArticle = async (req, res) => {
  const { articleId } = req.params; 

  try {

    const checkQuery = `
      SELECT * FROM baiviet 
      WHERE id = $1
    `;
    const checkResult = await pool.query(checkQuery, [articleId]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Bài viết không tồn tại" });
    }

    const query = `
    DELETE FROM baiviet 
    WHERE id = $1
    `;

    const values = [articleId];

    // Thực thi câu lệnh SQL
    const result = await pool.query(query, values);

    res.json({success: true, message: "Xóa bài viết thành công"})
    
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const addNewArticle = async (req, res) => {
  try {
    const { title, slug, description, content, date } = req.body; // Nhận dữ liệu từ request body

    // Kiểm tra xem các trường có được truyền đầy đủ không
    if (!title || !slug || !description || !content || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const checkQuery = `SELECT * FROM baiviet WHERE slug = $1`;
    const checkResult = await pool.query(checkQuery, [slug]);

    if (checkResult.rowCount > 0) {
      return res.json({ success: false, message: 'Bài viết bị trùng slug !!!' })
    }

    // Thực hiện truy vấn SQL để lưu bài viết vào cơ sở dữ liệu
    const query = `
      INSERT INTO baiviet (tieude, slug, mota, content, ngaydang)
      VALUES ($1, $2, $3, $4, $5)
    `;

    const values = [title, slug, description, content, date];

    // Thực thi câu lệnh SQL
    await pool.query(query, values);

    // Lấy bài viết đã lưu và trả về phản hồi
    return res.status(201).json({
      success: true,
      message: 'Bài viết mới đã được thêm thành công !!',
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateArticle = async (req, res) => {
  try {
    const { title, slug, description, content } = req.body; 
    const { articleId } = req.params; 

    if (!title || !slug || !description || !content ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const checkQuery = `SELECT * FROM baiviet WHERE slug = $1 and id != $2`;
    const checkResult = await pool.query(checkQuery, [slug, articleId]);

    if (checkResult.rowCount > 0) {
      return res.json({ success: false, message: 'Slug đã được sử dụng bởi bài viết khác!' });
    }

    const query = `
      UPDATE baiviet 
      SET tieude = $1, slug = $2, mota = $3, content = $4
      WHERE id = $5
    `;

    const values = [title, slug, description, content, articleId];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Bài viết không tồn tại' });
    }

    return res.json({
      success: true,
      message: 'Bài viết đã được cập nhật thành công!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  articleController: {
    uploadSingleImage,
    addNewArticle,
    getAllArticle,
    getArticleBySlug,
    getArticleById,
    deleteArticle,
    updateArticle      
  }
};