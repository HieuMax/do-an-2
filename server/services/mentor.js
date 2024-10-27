const mentorRouter = require('express').Router();
const { getAll, getById, addNewTeacher, updateTeacher, uploadTeacherList, deleteTeacher } = require('../controller/controller')
const { generateTeacherId } = require('../middleware/generateTeacherId');
const upload = require('../middleware/multer');
const cloudinary = require('cloudinary').v2;

module.exports = mentorRouter;

const obj = "mentors";

mentorRouter.get('/', async (req, res) => {
    const result = await getAll(obj);
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({giangvien: result.data})
    }
})

mentorRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const result = await getById(obj, id)
    if (result.error) {
        res.status(500).json({"error": result.error});
    } else {
        res.json({giangvien: result.data})
    }
})

mentorRouter.post('/addNewTeacher', upload.single('avtImage'), generateTeacherId, async (req, res) => {
    const { hoten, hocham, hocvi, mail, tennh, stknh, cccd, gioitinh, ngaysinh, khoaid, sdt } = req.body;
    const giangvienid = req.body.giangvienid;
    
    try {
        let imagesUrl = [];

        // Kiểm tra nếu có tệp được tải lên
        if (req.file) {
            const avtImage = req.file;
            const images = [avtImage].filter((item) => item !== undefined);

            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { 
                        resource_type: 'image',
                        folder: 'giang_vien'
                    });
                    return result.secure_url;
                })
            );
        } else {
            // Nếu không có tệp, bạn có thể sử dụng một URL mặc định hoặc xử lý theo cách khác
            // imagesUrl.push('URL_MAC_DINH_HOAC_NULL'); // Uncomment và thay thế nếu cần
        }

        const result = await addNewTeacher(
            giangvienid, hoten, hocham, hocvi, mail, tennh, stknh, cccd, gioitinh, ngaysinh, khoaid, sdt,
            imagesUrl[0] || null // Nếu không có ảnh, truyền giá trị null
        );

        if (result.error) {
            res.status(500).json({ error: result.error });
        } else {
            res.status(201).json({ giangvienid: result.giangvienid });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
mentorRouter.put('/updateTeacher/:id', upload.single('avtImage'), async (req, res) => {
    const { id } = req.params;
    const { hoten, hocham, hocvi, ngaysinh, gioitinh, khoaid, tennh, mail, sdt, stknh, cccd } = req.body;
    try {
        let imagesUrl = [];

        // Kiểm tra nếu có tệp được tải lên
        if (req.file) {
            const avtImage = req.file;
            const images = [avtImage].filter((item) => item !== undefined);

            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, { 
                        resource_type: 'image',
                        folder: 'giang_vien'
                    });
                    return result.secure_url;
                })
            );
        } else {
            // Nếu không có tệp, bạn có thể sử dụng một URL mặc định hoặc xử lý theo cách khác
            // imagesUrl.push('URL_MAC_DINH_HOAC_NULL'); // Uncomment và thay thế nếu cần
        }

        const result = await updateTeacher(
            id, hoten, hocham, hocvi, ngaysinh, gioitinh, khoaid, tennh, mail, sdt, stknh, cccd,
            imagesUrl[0] || null // Nếu không có ảnh, truyền giá trị null
        );

        if (result.error) {
            res.status(500).json({ error: result.error });
        } else {
            res.status(201).json({ giangvienid: result.giangvienid });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})
mentorRouter.post('/uploadTeacherList', uploadTeacherList)

mentorRouter.delete('/deleteTeacher/:id', deleteTeacher);