import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addNewTeacher } from '../../controller/2.mentors/mentors';
import { ManagementContext } from '../../context/ManagementContext';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import { getMentorById, updateTeacher } from '../../controller/2.mentors/mentors';
import { Skeleton } from 'antd';

const AddTeacher = ({ isEdit }) => {
  const { id } = useParams(); // lấy id giảng viên khi chỉnh sửa
  const [avtImage, setAvtImage] = useState(false);
  const [avtImageShow, setAvtImageShow] = useState(false);

  const [hoten, setHoten] = useState('');
  const [hocham, setHocham] = useState('');
  const [hocvi, setHocvi] = useState('');
  const [ngaysinh, setNgaysinh] = useState('2000-01-01');
  const [gioitinh, setGioitinh] = useState('');
  const [khoaid, setKhoaid] = useState('');
  const [tennh, setTennh] = useState('');
  const [mail, setMail] = useState('');
  const [sdt, setSDT] = useState('');
  const [stknh, setStknh] = useState('');
  const [cccd, setCccd] = useState('');

  const navigate = useNavigate();


  const {departmentsContext} = useContext(ManagementContext)
  const [selectedDepartment, setSelectedDepartment] = useState(''); // Lưu trữ Khoa được lựa chọn
  const [errors, setErrors] = useState({});

  const hotenRef = useRef(null);
  const hochamRef = useRef(null);
  const hocviRef = useRef(null);
  const gioitinhRef = useRef(null);
  const tennhRef = useRef(null);
  const mailRef = useRef(null);
  const cccdRef = useRef(null);
  const sdtRef = useRef(null);
  const stknhRef = useRef(null);

  const [loadingAdd, setLoadingAdd] = useState(false);

  const [initialTeacherData, setInitialTeacherData] = useState({});

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);


  const [changed, setChanged] = useState(true);


  useEffect(() => {
    if (isEdit && id) {
      // Lấy dữ liệu của giảng viên hiện tại
      async function fetchTeacherData() {
        try {
          const teacherData = await getMentorById(id); // Gọi API để lấy dữ liệu giảng viên
          const date = new Date(teacherData.ngaysinh);

        // Chuyển đổi thành định dạng yyyy-MM-dd
          const formattedDate = date.toISOString().split('T')[0];
          setHoten(teacherData.hoten);
          setHocham(teacherData.hocham);
          setHocvi(teacherData.hocvi);
          setNgaysinh(formattedDate);
          setGioitinh(teacherData.gioitinh);
          setSelectedDepartment(teacherData.khoaid);
          setKhoaid(teacherData.khoaid)
          setTennh(teacherData.tennh);
          setMail(teacherData.mail);
          setSDT(teacherData.sdt);
          setStknh(teacherData.stknh);
          setCccd(teacherData.cccd);
          setAvtImage(teacherData.avtimg);
          
          setInitialTeacherData({
            hoten: teacherData.hoten,
            hocham: teacherData.hocham,
            hocvi: teacherData.hocvi,
            ngaysinh: formattedDate,
            gioitinh: teacherData.gioitinh,
            khoaid: teacherData.khoaid,
            tennh: teacherData.tennh,
            mail: teacherData.mail,
            sdt: teacherData.sdt,
            stknh: teacherData.stknh,
            cccd: teacherData.cccd,
            avtimg: teacherData.avtimg,
          });
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu giảng viên:', error);
        }
      }

      fetchTeacherData();
    }
  }, [isEdit, id, changed]);



  /* ---------- Handle giá trị của các selection box ---------- */

 
  const handleDepartmentChange = (e) => {
    const departmentId = e.target.value;
    setSelectedDepartment(departmentId);
    setKhoaid(departmentId)
    if (errors.selectedDepartment) {
      setErrors((prev) => ({ ...prev, selectedDepartment: '' }));
    }
  };
  
  /// ------------------------------------



  const handleInputChange = (setter, fieldName) => (e) => {
    setter(e.target.value);
    if (errors[fieldName]) {
        setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }
  };

  // Usage for all fields
  const handleHoten = handleInputChange(setHoten, 'hoten');
  const handleHocham = handleInputChange(setHocham, 'hocham');
  const handleHocvi = handleInputChange(setHocvi, 'hocvi');
  const handleGioitinh = handleInputChange(setGioitinh, 'gioitinh');
  const handleKhoa = handleInputChange(setSelectedDepartment, 'khoa');
  const handleTennh = handleInputChange(setTennh, 'tennh');
  const handleMail = handleInputChange(setMail, 'mail');
  const handleCccd = handleInputChange(setCccd, 'cccd');
  const handleSdt = handleInputChange(setSDT, 'sdt');
  const handleSotknh = handleInputChange(setStknh, 'stknh');



  const resetForm = () => {
    setHoten('');
    setHocham('');
    setHocvi('');
    setNgaysinh('');
    setGioitinh('');
    setSelectedDepartment('');
    setTennh('');
    setMail('');
    setSDT('');
    setStknh('');
    setCccd('');
    setAvtImage(false);
  }

  const handleAddTeacher = async () => {

    let newErrors = {};
    let firstErrorField = null;

    const namePattern = /^.{2,34}$/;
    if (!namePattern.test(hoten)) {
      newErrors.hoten = 'Vui lòng nhập đầy đủ họ tên (3-34 ký tự)';
      if (!firstErrorField) {
        firstErrorField = hotenRef;
      }
    } 
    if (!namePattern.test(hocham)) {
      newErrors.hocham = 'Vui lòng nhập học hàm (3-34 ký tự)';
      if (!firstErrorField) {
        firstErrorField = hochamRef;
      }
    }
    if (!namePattern.test(hocvi)) {
      newErrors.hocvi = 'Vui lòng nhập học vị (3-34 ký tự)';
      if (!firstErrorField) {
        firstErrorField = hocviRef;
      }
    }
    // Validate gender
    if(!gioitinh){
      newErrors.gioitinh = 'Chưa chọn giới tính';
      if (!firstErrorField) {
        firstErrorField = gioitinhRef;
      }
    }
    // Validate khoa
    if (!selectedDepartment) {
      newErrors.selectedDepartment = 'Vui lòng chọn khoa';
      if (!firstErrorField) {
        firstErrorField = departmentRef;
      }
    }
    if (!namePattern.test(tennh)) {
      newErrors.tennh = 'Vui lòng nhập ngành học (3-34 ký tự)';
      if (!firstErrorField) {
        firstErrorField = tennhRef;
      }
    }
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(mail)) {
      newErrors.mail = 'Email không hợp lệ';
      if (!firstErrorField) {
        firstErrorField = mailRef;
      }
    }
    // Validate CCCD (12 digits)
    const cccdPattern = /^\d{12}$/;
    if (!cccdPattern.test(cccd)) {
      newErrors.cccd = 'Số căn cước công dân không hợp lệ';
      if (!firstErrorField) {
        firstErrorField = cccdRef;
      }
    }

    // Validate phone number (10 digits, starting with 03, 05, 07, 08, 09)
    const phonePattern = /^(03|05|07|08|09)\d{8}$/;
    if (!phonePattern.test(sdt)) {
      newErrors.sdt = 'Số điện thoại không hợp lệ';
      if (!firstErrorField) {
        firstErrorField = sdtRef;
      }
    } 
    // Validate bank account
    if(!stknh){
      newErrors.stknh = 'Chưa nhập số tk ngân hàng';
      if (!firstErrorField) {
        firstErrorField = stknhRef;
      }
    }


    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (firstErrorField && firstErrorField.current) {
        firstErrorField.current.focus();
      }
      return;
    }

    setErrors({});

    const hasChanges = (
      hoten !== initialTeacherData.hoten ||
      hocham !== initialTeacherData.hocham ||
      hocvi !== initialTeacherData.hocvi ||
      ngaysinh !== initialTeacherData.ngaysinh ||
      gioitinh !== initialTeacherData.gioitinh ||
      khoaid !== initialTeacherData.khoaid ||
      tennh !== initialTeacherData.tennh ||
      mail !== initialTeacherData.mail ||
      sdt !== initialTeacherData.sdt ||
      stknh !== initialTeacherData.stknh ||
      cccd !== initialTeacherData.cccd ||
      avtImage !== initialTeacherData.avtimg
    );
  
    if (!hasChanges) {
      toast.info('Không có thay đổi nào được cập nhật.');
      return;
    }

    const formData = new FormData()

    formData.append("hoten",hoten)
    formData.append("hocham",hocham)
    formData.append("hocvi",hocvi)
    formData.append("mail",mail)
    formData.append("tennh",tennh)
    formData.append("stknh",stknh)
    formData.append("cccd",cccd)
    formData.append("gioitinh",gioitinh)
    formData.append("ngaysinh",ngaysinh)
    formData.append("khoaid",khoaid)
    formData.append("sdt",sdt)

    avtImage && formData.append("avtImage",avtImage)
    // setLoadingAdd(true)

    try {
      if (isEdit) {
        await updateTeacher(id, formData); // Gọi hàm update thay vì thêm mới
        setChanged(!changed)

        toast.success('Cập nhật giảng viên thành công');
      } else {
        // Logic thêm mới giảng viên
        await addNewTeacher(formData);
        toast.success('Thêm giảng viên thành công');
        resetForm()

      }
      

    } catch (error) {
      toast.error('Bị trùng Mail, CCCD hoặc SĐT')
      // console.error('Failed to add new teacher:', error);
    } finally{
      // setLoadingAdd(false)

    }
  };

  const handleBackClick = () => {
    navigate('/teacher-management'); 
  };

  const handleAvtImgChoose = (e) => {
    setAvtImage(e.target.files[0])
    setAvtImageShow(e.target.files[0])
  }

  return (
    <div className="flex flex-col sm:flex-row w-full  ">
      {/* Left Column - Image */}
      <div className="sm:w-1/4 w-full p-8 flex flex-col items-center border-r-[1px] ">
        <div className="w-44 h-44 rounded-lg overflow-hidden mb-6">

        {isLoading ? (
          <Skeleton.Avatar active size={176} shape="square" />
        ) : (
          !isEdit ? (
            <img src={!avtImage ? assets.upload_area : URL.createObjectURL(avtImage)} alt="avatar" className="w-full h-full object-cover" />
          ) : avtImage && !avtImageShow ? (
            <img src={avtImage} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <img src={!avtImageShow ? assets.upload_area : URL.createObjectURL(avtImageShow)} alt="avatar" className="w-full h-full object-cover" />
          )
        )}
              
         
     
        </div>
        {
          isLoading
          ? ""
          : (
            <label className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer">
            Chọn ảnh đại diện
            <input
              type="file"
              className="hidden"
              accept="image/*"
              id="avtImage"
              onChange={handleAvtImgChoose}
              disabled={isLoading}
            />
          </label>
          )
        }
       
      </div>

      {/* Right Column - Form Fields */}
      <div className="sm:w-2/3 w-full p-8 flex flex-col bg-gray-100">
        { isLoading ? (
          
          <div className="grid grid-cols-1 gap-4">
              <Skeleton.Input className='my-2 mt-2' active style={{ width: '100%', height: '40px' }} />
              <Skeleton.Input className='my-2' active style={{ width: '100%', height: '40px' }} />
              <Skeleton.Input className='my-2' active style={{ width: '100%', height: '40px' }} />
              <Skeleton.Input className='my-2' active style={{ width: '100%', height: '40px' }} />
              <Skeleton.Input className='my-2' active style={{ width: '100%', height: '40px' }} />
              <Skeleton.Input className='my-2' active style={{ width: '100%', height: '40px' }} />
              <Skeleton.Input className='my-2' active style={{ width: '100%', height: '40px' }} />
              <Skeleton.Input className='my-2' active style={{ width: '100%', height: '40px' }} />
              <Skeleton.Input className='my-5' active style={{ width: '100%', height: '40px' }} />

          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 mb-4">
            <label className="font-bold">Họ tên</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={hoten}
              onChange={handleHoten}
              
            />
             {errors.hoten && (
              <p className="mt-1 text-sm text-red-600">{errors.hoten}</p>
            )}
          </div>
          <div className="col-span-1 mb-4">
            <label className="font-bold">Học hàm</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={hocham}
              onChange={handleHocham}
            />
             {errors.hocham && (
              <p className="mt-1 text-sm text-red-600">{errors.hocham}</p>
            )}
          </div>
          <div className="col-span-1 mb-4">
            <label className="font-bold">Học vị</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={hocvi}
              onChange={handleHocvi}
            />
             {errors.hocvi && (
              <p className="mt-1 text-sm text-red-600">{errors.hocvi}</p>
            )}
          </div>
          <div className="col-span-2 w-1/4 mb-4 ">
            <label className="font-bold">Ngày sinh</label>
            <input
              type="date"  // Thay đổi từ text thành date
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={ngaysinh}  // Bind state to input value
              onChange={(e) => setNgaysinh(e.target.value)}  // Cập nhật state khi người dùng chọn ngày
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="col-span-2 flex gap-4 mb-4 ">
            <label className="font-bold mr-6">Giới tính</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gioitinh"
                  value="0"
                  checked={gioitinh === '0'}
                  onChange={handleGioitinh}
                  className="mr-2"
                />
                Nam
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gioitinh"
                  value="1"
                  checked={gioitinh === '1'}
                  onChange={handleGioitinh}
                  className="mr-2"
                />
                Nữ
              </label>
              {errors.gioitinh && (
                <p className="mt-1 text-sm text-red-600">{errors.gioitinh}</p>
              )}
            </div>
          </div>

          <div className="col-span-1 mb-4">
            <label className="font-bold">Chọn khoa</label>
            <select
              id="department"
              value={selectedDepartment}
              // ref={departmentRef}
              onChange={handleDepartmentChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            >
              <option value="">Chọn khoa</option>
              {departmentsContext.map((department) => (
                <option key={department.khoaid} value={department.khoaid}>
                  {department.tenkhoa}
                </option>
              ))}
            </select>
            {errors.selectedDepartment && (
              <p className="mt-1 text-sm text-red-600">{errors.selectedDepartment}</p>
            )}
          </div>
          <div className="col-span-1 mb-4">
            <label className="font-bold">Tên ngành học</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={tennh}
              onChange={handleTennh}
            />
             {errors.tennh && (
              <p className="mt-1 text-sm text-red-600">{errors.tennh}</p>
            )}
          </div>
          <div className="col-span-2 mb-4">
            <label className="font-bold">Mail</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={mail}
              onChange={handleMail}
            />
             {errors.mail && (
              <p className="mt-1 text-sm text-red-600">{errors.mail}</p>
            )}
          </div>
          <div className="col-span-2 mb-4">
            <label className="font-bold">Số CCCD</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={cccd}
              onChange={handleCccd}
            />
             {errors.cccd && (
              <p className="mt-1 text-sm text-red-600">{errors.cccd}</p>
            )}
          </div>
          <div className="col-span-2 mb-4">
            <label className="font-bold">Số điện thoại</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={sdt}
              onChange={handleSdt}
            />
             {errors.sdt && (
              <p className="mt-1 text-sm text-red-600">{errors.sdt}</p>
            )}
          </div>
          <div className="col-span-2 mb-4">
            <label className="font-bold">Số tk ngân hàng</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={stknh}
              onChange={handleSotknh}
            />
             {errors.stknh && (
              <p className="mt-1 text-sm text-red-600">{errors.stknh}</p>
            )}
          </div>

        </div>
        )
          
        }


        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-4">
          {
            isLoading 
            ? "" 
            : (
              <>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                onClick={handleAddTeacher}
                disabled={loadingAdd}
              >
                {loadingAdd 
                        ?  
                        <svg className="mr-3 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg> 
                        : ''}
                <span className="font-medium">{loadingAdd ? ' Processing... ' : isEdit ? 'Cập nhật giảng viên' : 'Thêm giảng viên'}</span>
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                onClick={handleBackClick}

              >
                Trở về
              </button>
              </>
              
            )
          }
          

        </div>
      </div>
    </div>
  );
};

export default AddTeacher;
