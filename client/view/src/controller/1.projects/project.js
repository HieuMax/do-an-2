import { API_ENDPOINT } from "..";
import { useAuthStore } from "../../api/authStore";
import { getMentorById, getNameMentorById } from "../2.mentors/mentors";
import axios from "axios";
import { sendNoti } from "../7.notify/notify";

const url = "/projects";

export const getAllProjects = async (status, page) => {
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    const data = {
        userId: userInfo.userId,
        typeOfUser: userInfo.vaitro,
        page: page,
        status: status
    }
    const response = await fetch(`${API_ENDPOINT}${url}/accessProject/${JSON.stringify(data)}`);
    const projects = await response.json();
    const arr = projects.detai
    arr.forEach(async(element) => {
        const name = await getNameMentorById(element.giangvienchunhiemid);
        element.hotengiangvien = name
    });
    return projects;
}

export const getProjectPage = async (page) => {
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    const data = {
        userId: userInfo.userId,
        typeOfUser: userInfo.vaitro
    }
    const response = await fetch(`${API_ENDPOINT}${url}/accessProject/${JSON.stringify(data)}`);
    const projects = await response.json();
    const arr = projects.detai
    arr.forEach(async(element) => {
        const name = await getNameMentorById(element.giangvienchunhiemid);
        element.hotengiangvien = name
    });
    return projects;
}

export const getReportProject = async (statusIdx, page) => {
    const userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    const data = {
        userId: userInfo.userId,
        typeOfUser: userInfo.vaitro,
        statusIdx: statusIdx,
        page: page
    }
    const response = await fetch(`${API_ENDPOINT}${url}/accessReportProject/${JSON.stringify(data)}`);
    const projects = await response.json();
    const arr = projects.detai
    arr.forEach(async(element) => {
        const name = await getNameMentorById(element.giangvienchunhiemid);
        element.hotengiangvien = name
    });
    return projects;
}

export const updateProjectStatusAndCouncil = async (detaiid, status, council, taikhoanid) => {
    const data = {
        detaiid: detaiid,
        status: status,
        council: council,
        taikhoanid: taikhoanid
    };

    try {
        const response = await axios.put(`${API_ENDPOINT}${url}/updateStatusAndCouncil`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data
    } catch (error) {
        // Xử lý lỗi khi xảy ra
        return { error: error.response?.data?.message || error.message || 'Unexpected error occurred' };
    }
};

export const updateProjectliquidation = async (detaiid, status, council) => {
    const data = {
        detaiid: detaiid,
        status: status,
        council: council,
    };

    try {
        const response = await axios.put(`${API_ENDPOINT}${url}/updateLiquidation`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        return response.data
    } catch (error) {
        // Xử lý lỗi khi xảy ra
        return { error: error.response?.data?.message || error.message || 'Unexpected error occurred' };
    }
};

export const getProjectById = async(id) => {
    const response = await fetch(`${API_ENDPOINT}${url}/project/${id}`)
    const project = await response.json();
    // const fillInforMentor = async () => {
    const mentor = await getMentorById(project.detai.giangvienchunhiemid)
    // console.log(project.detai)
    const filledProject = {
        ...project.detai,
        hotenGV: mentor.hoten,  
        emailGV: mentor.mail,
        sdtGV: mentor.sdt,
        ...project.members
    }

    return filledProject;
    // }
}

export const updateStatusProject = async (status, id) => {
    const uid = JSON.parse(window.localStorage.getItem('userInfo')).taikhoanid
    const data = {
        status: status,
        id: id,
        uid: uid
    }
    const response = await fetch(`${API_ENDPOINT}${url}/updateStatus`, {
        method: "PUT",
        headers: {
            'Content-type': 'application/json',
            'apiKey': "notest"
        },
        body: JSON.stringify(data)
    })
}

export const uploadFile = async (formData) => {
    // console.log(formData)
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/uploadFile`, {
            method: 'POST',
            body: formData,
        })
        const json = await response.json()
        return json
    } catch (error) {
        return { error: error }
    }
}
export const getProjectsByStatus = async () => {
    try {
        const response = await axios.get(`${API_ENDPOINT}${url}/status`);
        if(!response.data.success){
            return response.data
        }
        return response.data;

    } catch (error) {
        return { success: false, message: 'Error' };
    }
}
export const registNewProject = async (data) => {
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/registNewProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if(response.error) {
            return { error: "Error"}
        }
        return response;
    } catch (error) {
        return { error: error }
    }
}

export const uploadProposalfile = async (data) => {
    // console.log("proposal: " + data)

    try {
        const response = await fetch(`${API_ENDPOINT}${url}/uploadProposal`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if(response.error) {
            return { error: "Error"}
        }
        await sendNoti(
            data.detaiid,
            3,
            1,
            1
        )
        return response;
    } catch (error) {
        return { error: error }
    }
}

export const uploadReportfile = async (data) => {
    // console.log("report: " + data)
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/uploadReport`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        if(response.error) {
            return { error: "Error"}
        }
        await sendNoti(
            data.detaiid,
            3,
            1,
            3
        )
        return response;
    } catch (error) {
        return { error: error }
    }
}


export const markProject = async(data) => {
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/markProject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if(response.error) {
            return { error: "Error"  }
        }
        await sendNoti(
            data.detaiid,
            data.type == "DeXuat" 
                ? 0 
                : data.type == "ThuyetMinh"
                  ? 1
                  : 2,
            0,
            data.type == "DeXuat" 
            ? 0 
            : data.type == "ThuyetMinh"
              ? 2
              : 4,
        )
        return response
    } catch (err) {
        return { error: err }
    }
}

export const getMarkOfProject = async(data) => {
    // console.log(data)
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/marks?type=${data.type}&role=${data.role}&detaiid=${data.detaiid}&userid=${data.userid}`)
        const projectMark = await response.json();
        // console.log(projectMark)
        return projectMark;
    } catch (error) {
        return { error: error }
    }
}

export const getProposalFile = async (detaiid) => {
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/proposalFile/${detaiid}`)
        const proposalfile = await response.json();
        // console.log(Object.keys(proposalfile).length < 1)
        return proposalfile.data;
    } catch (error) {
        return { error: error }
    }
    
}

export const getReportFile = async (detaiid) => {
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/reportFile/${detaiid}`)
        const proposalfile = await response.json();
        // console.log(Object.keys(proposalfile).length < 1)
        return proposalfile.data;
    } catch (error) {
        return { error: error }
    }
    
}

export const downloadFile = async (filename, originalname) => {
    try {
        fetch(`${API_ENDPOINT}${url}/download/${filename}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = originalname; // Tên file khi tải về
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch(error => console.error('Error downloading file:', error));

        const json = await response.json();
        // console.log(json)
        return json
    } catch (error) {
        return { error: error }
    }
}

export const projectPermission = async (detaiid, uid) => {
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/accessProjectPermission/?uid=${uid}&detaiid=${detaiid}`)
        const permission = await response.json();
        return permission;
    } catch (error) {
        return { error: error }
    }
}
export const reportPermission = async (detaiid, uid, report) => {
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/accessReportPermission/?uid=${uid}&detaiid=${detaiid}`)
        const permission = await response.json();
        return permission;
    } catch (error) {
        return { error: error }
    }
}
export const getAllProjectsDashboard = async () => {
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/projectDetails/`)
        const data = await response.json();
    
        return data;
        // return permission;
    } catch (error) {
        return { error: error }
    }
}
export const getQuantityOfDocsByID = async (detaiid) => {
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/countDeTaiOccurrences/${detaiid}`)
        const data = await response.json();
        return data;
        // return permission;
    } catch (error) {
        return { error: error }
    }
}

export const getTotalMarksOfProject = async (detaiid) => {
    try {
        const response = await fetch(`${API_ENDPOINT}${url}/getTotalScoreByDeTaiID/${detaiid}`)
        const data = await response.json();
        return data;
        // return permission;
    } catch (error) {
        return { error: error }
    }
}
// export const insertMemberToProject = async (data) => {
//     try {

//     }
// }

export const updateFile = async(data) => {
        // if(!response.ok) {
        //     const errorText = await response.text(); // Get error message from the server
        //     console.error('Error response:', errorText);
        //     throw new Error(`Error: ${response.status} - ${errorText}`);
        // }
        // if(response.status === 201) {    
        //     const jsonResponse = await response.json();
        //     // console.log(jsonResponse)
        //     const response = await fetch(`${API_ENDPOINT}${url}/updatefile/?type="tailieudexuat"&&file=${data.TaiLieuDeXuat}&&id=${jsonResponse.detaiid}`, {
        //         method: 'PUT',
        //         body: JSON.stringify(data.TaiLieuDeXuat),
        //     })
        // }
}
// module.exports = 

