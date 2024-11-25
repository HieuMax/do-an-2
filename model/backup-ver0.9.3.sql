--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

-- Started on 2024-11-26 00:41:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 241 (class 1255 OID 16747)
-- Name: tg_autochangetitletopic(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.tg_autochangetitletopic() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    status_update SMALLINT;
    var_detaiid VARCHAR(13);
BEGIN
    -- Get detaiid from the inserted row
    var_detaiid := NEW.detaiid;

    -- Count the number of nguoichamdiem for the detaiid
    SELECT trangthai INTO status_update
    FROM detai
    WHERE detaiid = var_detaiid;

    -- If 5 nguoichamdiem found, update the detai table
    IF status_update = 1 THEN
        UPDATE topics
        SET title = 'Cập nhật thông tin đề tài'
        WHERE detaiid = var_detaiid;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.tg_autochangetitletopic() OWNER TO postgres;

--
-- TOC entry 242 (class 1255 OID 16748)
-- Name: tg_autocheckbaocao(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.tg_autocheckbaocao() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    flag_update SMALLINT;
    var_detaiid VARCHAR(13);
BEGIN
    -- Get detaiid from the inserted row
    var_detaiid := NEW.detaiid;

    -- Count the number of nguoichamdiem for the detaiid
    SELECT COUNT(nguoichamdiem) INTO flag_update
    FROM diemtailieubaocao
    WHERE detaiid = var_detaiid;

    -- If 5 nguoichamdiem found, update the detai table
    IF flag_update = 5 THEN
        UPDATE detai
        SET trangthai = 6
        WHERE detaiid = var_detaiid;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.tg_autocheckbaocao() OWNER TO postgres;

--
-- TOC entry 243 (class 1255 OID 16749)
-- Name: tg_autocheckchamdiemthuyetminh(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.tg_autocheckchamdiemthuyetminh() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    flag_update SMALLINT;
    var_detaiid VARCHAR(13);
BEGIN
    -- Get detaiid from the inserted row
    var_detaiid := NEW.detaiid;

    -- Count the number of nguoichamdiem for the detaiid
    SELECT COUNT(nguoichamdiem) INTO flag_update
    FROM diemtailieuthuyetminh
    WHERE detaiid = var_detaiid;

    -- If 5 nguoichamdiem found, update the detai table
    IF flag_update = 5 THEN
        UPDATE detai
        SET trangthai = 3
        WHERE detaiid = var_detaiid;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.tg_autocheckchamdiemthuyetminh() OWNER TO postgres;

--
-- TOC entry 244 (class 1255 OID 16750)
-- Name: tg_autocheckduyetdexuat(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.tg_autocheckduyetdexuat() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    flag_update SMALLINT;
    var_detaiid VARCHAR(13);
BEGIN
    -- Get detaiid from the inserted row
    var_detaiid := NEW.detaiid;

    -- Count the number of nguoichamdiem for the detaiid
    SELECT COUNT(nguoichamdiem) INTO flag_update
    FROM diemtailieudexuat
    WHERE diemtailieudexuat.detaiid = var_detaiid;

    -- If 5 nguoichamdiem found, update the detai table
    IF flag_update = 5 THEN
        UPDATE detai
        SET trangthai = 2
        WHERE detai.detaiid = var_detaiid;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.tg_autocheckduyetdexuat() OWNER TO postgres;

--
-- TOC entry 256 (class 1255 OID 16751)
-- Name: tg_autoinserttogroupconsumer(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.tg_autoinserttogroupconsumer() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    var_taikhoanid INTEGER;
    var_typeUser VARCHAR(10);
    var_groupid BOOLEAN;
BEGIN
    -- Get taikhoanid from the inserted row
    var_taikhoanid := NEW.taikhoanid;

    IF NEW.vaitro = 'Admin' THEN
        -- Check if groupconsumerid 'BQL' exists in groupconsumer table
        SELECT EXISTS (
            SELECT 1
            FROM groupconsumer
            WHERE groupconsumerid = 'BQL'
        ) INTO var_groupid;

        -- If groupconsumerid 'BQL' exists, insert into consumers
        IF var_groupid THEN
            INSERT INTO consumers (groupconsumerid, taikhoanid)
            VALUES ('BQL', var_taikhoanid);
        ELSE
            -- If 'BQL' does not exist, insert into groupconsumer and then into consumers
            INSERT INTO groupconsumer (groupconsumerid, name_group)
            VALUES ('BQL', 'Ban Quản Lý');
            
            INSERT INTO consumers (groupconsumerid, taikhoanid)
            VALUES ('BQL', var_taikhoanid);
        END IF;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.tg_autoinserttogroupconsumer() OWNER TO postgres;

--
-- TOC entry 257 (class 1255 OID 16752)
-- Name: tg_autoupdatestatusreportfile(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.tg_autoupdatestatusreportfile() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    flag_update SMALLINT;
    var_detaiid VARCHAR(13);
BEGIN
    -- Get detaiid from the inserted row
    var_detaiid := NEW.detaiid;

    -- Count the number of nguoichamdiem for the detaiid
    SELECT COUNT(detaiid) INTO flag_update
    FROM tailieubaocao
    WHERE detaiid = var_detaiid;

    -- If 5 nguoichamdiem found, update the detai table
    IF flag_update = 1 THEN
        UPDATE detai
        SET trangthai = 5
        WHERE detaiid = var_detaiid;
    END IF;

    RETURN NEW;
END;
$$;


ALTER FUNCTION public.tg_autoupdatestatusreportfile() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16753)
-- Name: baiviet; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.baiviet (
    id integer NOT NULL,
    tieude character varying NOT NULL,
    slug text NOT NULL,
    mota character varying NOT NULL,
    content character varying NOT NULL,
    ngaydang date NOT NULL
);


ALTER TABLE public.baiviet OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16758)
-- Name: baiviet_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.baiviet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.baiviet_id_seq OWNER TO postgres;

--
-- TOC entry 5046 (class 0 OID 0)
-- Dependencies: 216
-- Name: baiviet_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.baiviet_id_seq OWNED BY public.baiviet.id;


--
-- TOC entry 217 (class 1259 OID 16759)
-- Name: bophanql; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bophanql (
    manql character varying(20) NOT NULL,
    tennql character varying(255) NOT NULL,
    sdt character varying(13) NOT NULL,
    mail character varying(255) NOT NULL,
    tenbophan character varying(255) NOT NULL,
    taikhoanid integer
);


ALTER TABLE public.bophanql OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16764)
-- Name: consumers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consumers (
    groupconsumerid character varying(13) NOT NULL,
    taikhoanid integer NOT NULL
);


ALTER TABLE public.consumers OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16767)
-- Name: detai; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.detai (
    detaiid character varying(10) NOT NULL,
    tendetai character varying(255) NOT NULL,
    linhvuc character varying(255) NOT NULL,
    kinhphi numeric NOT NULL,
    trangthai integer DEFAULT 0,
    thoigianthuchien integer NOT NULL,
    ngaybatdau date,
    tailieudexuat text,
    giangvienchunhiemid character varying(13) NOT NULL,
    sinhvienid character varying(13) NOT NULL,
    hoidongphancong character varying(10),
    originalfilename text
);


ALTER TABLE public.detai OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16773)
-- Name: diemtailieubaocao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diemtailieubaocao (
    detaiid character varying(13) NOT NULL,
    nguoichamdiem character varying(13) NOT NULL,
    nhanxet text,
    diemtailieu double precision NOT NULL,
    diemtc1 smallint NOT NULL,
    diemtc2 smallint NOT NULL,
    diemtc3 smallint NOT NULL,
    diemtc4 smallint NOT NULL,
    diemtc5 smallint NOT NULL,
    diemtc6 smallint NOT NULL,
    diemtc7 smallint NOT NULL,
    diemtc8 smallint NOT NULL,
    diemtc9 smallint NOT NULL
);


ALTER TABLE public.diemtailieubaocao OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16778)
-- Name: diemtailieudexuat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diemtailieudexuat (
    detaiid character varying(13) NOT NULL,
    nguoichamdiem character varying(13) NOT NULL,
    nhanxet text,
    diemtc1 smallint NOT NULL,
    diemtc2 smallint NOT NULL,
    diemtc3 smallint NOT NULL,
    diemtc4 smallint NOT NULL,
    diemtc5 smallint NOT NULL,
    diemtc6 smallint NOT NULL,
    diemtc7 smallint NOT NULL,
    diemtc8 smallint NOT NULL,
    diemtailieu double precision NOT NULL
);


ALTER TABLE public.diemtailieudexuat OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16783)
-- Name: diemtailieuthuyetminh; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diemtailieuthuyetminh (
    nguoichamdiem character varying(13) NOT NULL,
    diemtailieu double precision NOT NULL,
    nhanxet text,
    detaiid character varying(10) NOT NULL,
    diemtc1 smallint NOT NULL,
    diemtc2 smallint NOT NULL,
    diemtc3 smallint NOT NULL,
    diemtc4 smallint NOT NULL,
    diemtc5 smallint NOT NULL,
    diemtc6 smallint NOT NULL,
    diemtc7 smallint NOT NULL,
    diemtc8 smallint NOT NULL
);


ALTER TABLE public.diemtailieuthuyetminh OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16788)
-- Name: giangvien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.giangvien (
    giangvienid character varying(13) NOT NULL,
    hoten character varying(255) NOT NULL,
    hocham character varying(255),
    hocvi character varying(255),
    mail character varying(255) NOT NULL,
    tennh character varying(255),
    stknh character varying(30),
    cccd character(12) NOT NULL,
    gioitinh character(1) NOT NULL,
    ngaysinh date NOT NULL,
    khoaid character varying(13),
    taikhoanid integer,
    sdt character varying,
    avtimg text,
    CONSTRAINT giangvien_gioitinh_check CHECK ((gioitinh = ANY (ARRAY['0'::bpchar, '1'::bpchar])))
);


ALTER TABLE public.giangvien OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16794)
-- Name: groupconsumer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groupconsumer (
    groupconsumerid character varying(13) NOT NULL,
    name_group text NOT NULL
);


ALTER TABLE public.groupconsumer OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16799)
-- Name: hoidong; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hoidong (
    hoidongid character varying(10) NOT NULL,
    tenhoidong character varying(255) NOT NULL,
    mota text
);


ALTER TABLE public.hoidong OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16804)
-- Name: hoidong_hoidongid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hoidong_hoidongid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hoidong_hoidongid_seq OWNER TO postgres;

--
-- TOC entry 5047 (class 0 OID 0)
-- Dependencies: 226
-- Name: hoidong_hoidongid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hoidong_hoidongid_seq OWNED BY public.hoidong.hoidongid;


--
-- TOC entry 227 (class 1259 OID 16805)
-- Name: khoa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.khoa (
    khoaid character varying(13) NOT NULL,
    tenkhoa character varying(255) NOT NULL
);


ALTER TABLE public.khoa OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16808)
-- Name: lop; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lop (
    lopid character varying(13) NOT NULL,
    tenlop character varying(255) NOT NULL,
    covan character varying(13),
    khoaid character varying(13)
);


ALTER TABLE public.lop OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16811)
-- Name: seenmsgs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seenmsgs (
    taikhoanid integer NOT NULL,
    messagesid integer NOT NULL,
    seen boolean DEFAULT false NOT NULL
);


ALTER TABLE public.seenmsgs OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16815)
-- Name: sinhvien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sinhvien (
    sinhvienid character varying(13) NOT NULL,
    hoten character varying(255) NOT NULL,
    mail character varying(255) NOT NULL,
    tennh character varying(255),
    stknh character varying(30),
    cccd character(12) NOT NULL,
    gioitinh character(1) NOT NULL,
    ngaysinh date NOT NULL,
    taikhoanid integer,
    lopid character varying(13),
    avtimg text,
    CONSTRAINT sinhvien_gioitinh_check CHECK ((gioitinh = ANY (ARRAY['0'::bpchar, '1'::bpchar])))
);


ALTER TABLE public.sinhvien OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16821)
-- Name: taikhoan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.taikhoan (
    taikhoanid integer NOT NULL,
    tendangnhap character varying(255) NOT NULL,
    matkhau character varying(255) NOT NULL,
    vaitro character varying(10) NOT NULL,
    "_webSocket" boolean DEFAULT false NOT NULL,
    resetpwdtoken text,
    resetpwdexp text,
    CONSTRAINT taikhoan_vaitro_check CHECK (((vaitro)::text = ANY (ARRAY[('Student'::character varying)::text, ('Teacher'::character varying)::text, ('Admin'::character varying)::text])))
);


ALTER TABLE public.taikhoan OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16828)
-- Name: taikhoan_taikhoanid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.taikhoan_taikhoanid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.taikhoan_taikhoanid_seq OWNER TO postgres;

--
-- TOC entry 5048 (class 0 OID 0)
-- Dependencies: 232
-- Name: taikhoan_taikhoanid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.taikhoan_taikhoanid_seq OWNED BY public.taikhoan.taikhoanid;


--
-- TOC entry 233 (class 1259 OID 16829)
-- Name: tailieubaocao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tailieubaocao (
    tailieupath text NOT NULL,
    detaiid character varying(10) NOT NULL,
    ngaynop text NOT NULL,
    originalfilename text NOT NULL
);


ALTER TABLE public.tailieubaocao OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16834)
-- Name: tailieuthuyetminh; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tailieuthuyetminh (
    tailieupath text NOT NULL,
    detaiid character varying(10) NOT NULL,
    ngaynop text NOT NULL,
    originalfilename text NOT NULL
);


ALTER TABLE public.tailieuthuyetminh OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16839)
-- Name: thanhvienhd; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thanhvienhd (
    hoidongid character varying(10) NOT NULL,
    giangvienid character varying(13) NOT NULL,
    vaitro character varying(255) NOT NULL
);


ALTER TABLE public.thanhvienhd OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16842)
-- Name: thanhvienthuchien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thanhvienthuchien (
    detaiid character varying(10) NOT NULL,
    sinhvienid character varying(13) NOT NULL
);


ALTER TABLE public.thanhvienthuchien OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16845)
-- Name: topics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.topics (
    id integer NOT NULL,
    title text NOT NULL,
    groupconsumerid character varying(13) NOT NULL,
    detaiid character varying(10)
);


ALTER TABLE public.topics OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16850)
-- Name: topics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.topics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.topics_id_seq OWNER TO postgres;

--
-- TOC entry 5049 (class 0 OID 0)
-- Dependencies: 238
-- Name: topics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.topics_id_seq OWNED BY public.topics.id;


--
-- TOC entry 239 (class 1259 OID 16851)
-- Name: unseenmsgs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.unseenmsgs (
    taikhoanid integer NOT NULL,
    messagesid integer NOT NULL,
    time_stamp text NOT NULL,
    topicid integer NOT NULL,
    _message text
);


ALTER TABLE public.unseenmsgs OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16856)
-- Name: unseenmsgs_messagesid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.unseenmsgs_messagesid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unseenmsgs_messagesid_seq OWNER TO postgres;

--
-- TOC entry 5050 (class 0 OID 0)
-- Dependencies: 240
-- Name: unseenmsgs_messagesid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.unseenmsgs_messagesid_seq OWNED BY public.unseenmsgs.messagesid;


--
-- TOC entry 4778 (class 2604 OID 17066)
-- Name: baiviet id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baiviet ALTER COLUMN id SET DEFAULT nextval('public.baiviet_id_seq'::regclass);


--
-- TOC entry 4781 (class 2604 OID 17067)
-- Name: taikhoan taikhoanid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taikhoan ALTER COLUMN taikhoanid SET DEFAULT nextval('public.taikhoan_taikhoanid_seq'::regclass);


--
-- TOC entry 4783 (class 2604 OID 17068)
-- Name: topics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics ALTER COLUMN id SET DEFAULT nextval('public.topics_id_seq'::regclass);


--
-- TOC entry 4784 (class 2604 OID 17069)
-- Name: unseenmsgs messagesid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unseenmsgs ALTER COLUMN messagesid SET DEFAULT nextval('public.unseenmsgs_messagesid_seq'::regclass);


--
-- TOC entry 5015 (class 0 OID 16753)
-- Dependencies: 215
-- Data for Name: baiviet; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.baiviet (id, tieude, slug, mota, content, ngaydang) FROM stdin;
1	STST	stst	123123	<p><strong>Vi</strong>etes gi<em> giowf</em></p><p><img src="https://res.cloudinary.com/dm7nojb8g/image/upload/v1731900087/bai_viet/jwlijyvdzmu2pd4bmvwl.png"></p>	2024-11-18
\.


--
-- TOC entry 5017 (class 0 OID 16759)
-- Dependencies: 217
-- Data for Name: bophanql; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bophanql (manql, tennql, sdt, mail, tenbophan, taikhoanid) FROM stdin;
BP001	Ban Quản Lý 1	0123456789	bql1@example.com	Bộ Phận A	3
BP002	Ban QL 2	1234579584	bql2@example.com	Bo Phan B	28
\.


--
-- TOC entry 5018 (class 0 OID 16764)
-- Dependencies: 218
-- Data for Name: consumers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consumers (groupconsumerid, taikhoanid) FROM stdin;
BQL	28
SnM2024008	2
SnM2024008	1
SnM2024009	9
SnM2024009	1
SnM2024010	9
SnM2024010	1
SnM2024025	9
SnM2024025	1
PCHD_HD001	2
PCHD_HD001	6
PCHD_HD001	7
PCHD_HD001	8
PCHD_HD001	9
SnM2024026	9
SnM2024026	1
SnM2024027	9
SnM2024027	1
SnM2024028	2
SnM2024028	1
SnM2024029	2
SnM2024029	1
\.


--
-- TOC entry 5019 (class 0 OID 16767)
-- Dependencies: 219
-- Data for Name: detai; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.detai (detaiid, tendetai, linhvuc, kinhphi, trangthai, thoigianthuchien, ngaybatdau, tailieudexuat, giangvienchunhiemid, sinhvienid, hoidongphancong, originalfilename) FROM stdin;
DT20240011	AI ung dung	CNTT	1000000	1	10	\N	1730185550501-f.docx	GV001	SV001	HD001	KhoaHocKyThuat_d.docx
DT2024002	AI ung dung XCS	CNTT	10000000	2	1	\N	1730259168254-f.docx	GV001	SV001	HD001	PCCV.docx
DT2024020	Xu ly ngon ngu tu nhien	CNTT	1400000	1	7	\N	1730185550520-f.docx	GV004	SV001	HD001	NLP_AI_d.docx
DT2024025	OKLS 2323	CNTT	23232323	1	2	\N	1730690399827-f.pdf	GV006	SV001	HD001	Technical guide.pdf
DT2024026	OKLS xxx	CNTT	12312312	2	12	\N	1730707981282-f.docx	GV006	SV001	HD001	Deployment_and_Security_Webapp (2).docx
DT2024007	Intergration testing 	CNTT	1200000	3	12	\N	1730574034853-f.docx	GV006	SV001	HD001	PCCV (1) (1).docx
DT2024004	OKLS	CNTT	10101010	1	12	\N	1730360644121-f.docx	GV001	SV001	\N	Deployment_and_Security_Webapp (2).docx
DT2024027	OKLS23	CNTT	232323	1	23	\N	1730876246911-f.pdf	GV006	SV001	\N	06. JUNIT (1).pdf
DT2024009	Hệ thống Testing 03	CNTT	12312312	1	12	\N	1730642407415-f.pdf	GV006	SV001	\N	07. Selenium WebDriver.pdf
DT2024028	System testing	CNTT	1000000	1	12	\N	1731899724417-f.pdf	GV001	SV001	HD001	06. JUNIT (1).pdf
DT2024029	Hệ thống Testing	CNTT	1000000	0	12	\N	1731913455628-f.pdf	GV001	SV001	\N	06. JUNIT (1).pdf
DT2024010	Hệ thống Testing 123	CNTT	12312312	1	12	\N	1730644329054-f.pdf	GV006	SV001	\N	Technical guide.pdf
DT2024008	Hệ thống Testing	CNTT	1000000	1	12	\N	1730641116889-f.pdf	GV001	SV001	\N	07. Selenium WebDriver.pdf
DT2024021	AI ung dung	CNTT	1000000	5	10	\N	1730185550511-f.docx	GV001	SV001	HD001	KhoaHocKyThuat_d.docx
DT2024022	Phan tich du lieu	CNTT	1200000	5	8	\N	1730185550512-f.docx	GV002	SV001	HD001	NghienCuuDuLieu_d.docx
DT2024005	Hệ thống Testing	CNTT	1000000	1	12	\N	1730549885089-f.docx	GV006	SV001	HD001	PCCV.docx
DT2024006	Hệ thống Testing BRT	CNTT	12000000	1	12	\N	1730571068094-f.pdf	GV006	SV001	\N	03. Types of Testing.pdf
DT2024023	Hoc may	CNTT	1500000	5	7	\N	1730185550513-f.docx	GV003	SV001	HD001	TriTueNhanTao_d.docx
DT2024015	He thong thong minh	CNTT	1100000	5	8	\N	1730185550515-f.docx	GV005	SV001	HD001	MangThongMinh_d.docx
DT2024019	Bao mat thong tin	CNTT	1150000	5	5	\N	1730185550519-f.docx	GV003	SV001	HD001	AnToanThongTin_d.docx
DT20240012	Phan tich du lieu	CNTT	1200000	6	8	\N	1730185550502-f.docx	GV002	SV002	HD001	NghienCuuDuLieu_d.docx
DT2024018	Mang may tinh	CNTT	950000	6	4	\N	1730185550518-f.docx	GV002	SV001	HD001	MangMayTinh_d.docx
DT2024003	AI XXX	CNTT	12312312	1	12	\N	1730259495400-f.docx	GV001	SV001	\N	Deployment_and_Security_Webapp (2).docx
DT2024001	AI ung dung	CNTT	1000000	5	10	\N	1730185550501-f.docx	GV001	SV001	HD001	Khoa hoÃÂ£c kiÃ_ thuaÃÂ£Ã_t.docx
DT2024017	Phan mem ung dung	CNTT	1000000	0	6	\N	1730185550517-f.docx	GV001	SV001	HD001	PhatTrienPhanMem_d.docx
DT2024024	Khoa hoc du lieu	CNTT	900000	0	4	\N	1730185550514-f.docx	GV004	SV001	HD001	PhanTichDuLieu_d.docx
DT2024016	Tri tue nhan tao	CNTT	1300000	1	5	\N	1730185550516-f.docx	GV006	SV001	HD001	AIUngDung_d.docx
DT20240014	Khoa hoc du lieu	CNTT	900000	1	4	\N	1730185550504-f.docx	GV004	SV001	HD001	PhanTichDuLieu_d.docx
DT20240013	Hoc may	CNTT	1500000	1	7	\N	1730185550503-f.docx	GV003	SV003	HD001	TriTueNhanTao_d.docx
\.


--
-- TOC entry 5020 (class 0 OID 16773)
-- Dependencies: 220
-- Data for Name: diemtailieubaocao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diemtailieubaocao (detaiid, nguoichamdiem, nhanxet, diemtailieu, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6, diemtc7, diemtc8, diemtc9) FROM stdin;
\.


--
-- TOC entry 5021 (class 0 OID 16778)
-- Dependencies: 221
-- Data for Name: diemtailieudexuat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diemtailieudexuat (detaiid, nguoichamdiem, nhanxet, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6, diemtc7, diemtc8, diemtailieu) FROM stdin;
DT2024026	GV006	\N	10	10	10	10	10	10	10	10	80
DT2024026	GV001	\N	9	9	9	9	9	9	9	9	72
DT2024026	GV003	9	8	9	10	10	10	10	10	10	77
DT2024026	GV004	\N	9	9	9	9	9	9	10	9	73
DT2024026	GV005	\N	9	10	10	10	10	10	10	10	79
\.


--
-- TOC entry 5022 (class 0 OID 16783)
-- Dependencies: 222
-- Data for Name: diemtailieuthuyetminh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diemtailieuthuyetminh (nguoichamdiem, diemtailieu, nhanxet, detaiid, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6, diemtc7, diemtc8) FROM stdin;
\.


--
-- TOC entry 5023 (class 0 OID 16788)
-- Dependencies: 223
-- Data for Name: giangvien; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.giangvien (giangvienid, hoten, hocham, hocvi, mail, tennh, stknh, cccd, gioitinh, ngaysinh, khoaid, taikhoanid, sdt, avtimg) FROM stdin;
GV001	Nguyễn Văn A	TS	Thạc sĩ	gva@example.com	CNTT	123456789	123456789012	0	1980-01-01	K001	2	0909797979	\N
GV002	Trần Thị B	TS	Cử nhân	gtb@example.com	KT	987654321	123456789013	1	1985-02-02	K002	5	0389567789	\N
GV003	Lê Văn C	PGS	Thạc sĩ	gvc@example.com	NN	456123789	123456789014	0	1982-03-03	K001	6	0959595959	\N
GV004	Nguyễn X	\N	ThS	gvx@ex.edu.vn	NN	123490581	123456789015	1	1982-03-15	K001	7	0985939105	\N
GV005	Trần Y	\N	\N	gvy@edu.vn	KT	123595329	123456789016	0	1985-05-03	K001	8	0395092133	\N
GV006	K O P	TS	ThS	gvk@edu.vn	CNTT	123457493	123456789017	1	1986-08-08	K001	9	0376438593	\N
\.


--
-- TOC entry 5024 (class 0 OID 16794)
-- Dependencies: 224
-- Data for Name: groupconsumer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.groupconsumer (groupconsumerid, name_group) FROM stdin;
BQL	Ban Quan Ly
SnM2024008	Giảng viên hướng dẫn đề tài DT2024008
SnM2024009	Giảng viên hướng dẫn đề tài DT2024009
SnM2024010	Giảng viên hướng dẫn đề tài DT2024010
SnM2024025	Giảng viên hướng dẫn đề tài DT2024025
PCHD_HD001	Hội đồng HD001
SnM2024026	Giảng viên hướng dẫn đề tài DT2024026
SnM2024027	Giảng viên hướng dẫn đề tài DT2024027
SnM2024028	Giảng viên hướng dẫn đề tài DT2024028
SnM2024029	Giảng viên hướng dẫn đề tài DT2024029
\.


--
-- TOC entry 5025 (class 0 OID 16799)
-- Dependencies: 225
-- Data for Name: hoidong; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hoidong (hoidongid, tenhoidong, mota) FROM stdin;
HD001	HOI DONG 1	HD1
HD002	Hoi dong 2	HD2
\.


--
-- TOC entry 5027 (class 0 OID 16805)
-- Dependencies: 227
-- Data for Name: khoa; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.khoa (khoaid, tenkhoa) FROM stdin;
K001	Khoa Công Nghệ Thông Tin
K002	Khoa Kinh Tế
K003	Khoa Ngoại Ngữ
K004	Khoa Luật
K005	Khoa Giáo Dục
\.


--
-- TOC entry 5028 (class 0 OID 16808)
-- Dependencies: 228
-- Data for Name: lop; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lop (lopid, tenlop, covan, khoaid) FROM stdin;
L001	Lớp CNTT01	GV001	K001
L002	Lớp KT02	GV001	K002
L003	Lớp NN03	GV001	K003
L004	Lớp L04	GV002	K004
L005	Lớp GD05	GV002	K005
\.


--
-- TOC entry 5029 (class 0 OID 16811)
-- Dependencies: 229
-- Data for Name: seenmsgs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.seenmsgs (taikhoanid, messagesid, seen) FROM stdin;
28	119	f
1	118	t
2	117	t
9	120	t
1	121	f
28	122	f
1	124	f
28	125	t
1	126	f
1	128	t
9	130	t
9	123	t
1	131	f
28	129	t
28	132	t
2	133	f
6	133	f
7	133	f
8	133	f
9	133	t
9	134	t
1	135	f
28	136	t
9	137	t
2	137	t
6	137	t
7	137	t
8	137	t
9	138	f
1	138	t
2	139	f
6	139	f
7	139	f
8	139	f
9	139	f
9	140	t
1	141	t
28	142	t
28	127	t
2	143	t
1	144	f
28	145	t
6	146	f
7	146	f
8	146	f
9	146	f
2	146	t
2	147	f
\.


--
-- TOC entry 5030 (class 0 OID 16815)
-- Dependencies: 230
-- Data for Name: sinhvien; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sinhvien (sinhvienid, hoten, mail, tennh, stknh, cccd, gioitinh, ngaysinh, taikhoanid, lopid, avtimg) FROM stdin;
SV001	Nguyễn Văn F	svf@example.com	CNTT	321654987	123456789017	0	2000-01-01	1	L001	\N
SV002	Trần Thị G	svg@example.com	KT	987321456	123456789018	1	2001-02-02	4	L002	\N
SV003	Lê Văn H	svh@example.com	NN	654321987	123456789019	0	2002-03-03	1	L003	\N
\.


--
-- TOC entry 5031 (class 0 OID 16821)
-- Dependencies: 231
-- Data for Name: taikhoan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.taikhoan (taikhoanid, tendangnhap, matkhau, vaitro, "_webSocket", resetpwdtoken, resetpwdexp) FROM stdin;
5	T02	1	Teacher	f	\N	\N
2	T01	1	Teacher	f	\N	\N
1	S01	1	Student	f	\N	\N
4	S02	1	Student	f	\N	\N
6	T03	1	Teacher	f	\N	\N
7	T04	1	Teacher	f	\N	\N
8	T05	1	Teacher	f	\N	\N
9	T06	1	Teacher	f	\N	\N
28	admin2	admin2	Admin	f	\N	\N
3	system	NotUseAdmin	Admin	t	\N	\N
\.


--
-- TOC entry 5033 (class 0 OID 16829)
-- Dependencies: 233
-- Data for Name: tailieubaocao; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tailieubaocao (tailieupath, detaiid, ngaynop, originalfilename) FROM stdin;
\.


--
-- TOC entry 5034 (class 0 OID 16834)
-- Dependencies: 234
-- Data for Name: tailieuthuyetminh; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tailieuthuyetminh (tailieupath, detaiid, ngaynop, originalfilename) FROM stdin;
1730708200882-f.docx	DT2024026	15:16:40 - 4/10/2024	Deployment_and_Security_Webapp (2) (1).docx
\.


--
-- TOC entry 5035 (class 0 OID 16839)
-- Dependencies: 235
-- Data for Name: thanhvienhd; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thanhvienhd (hoidongid, giangvienid, vaitro) FROM stdin;
HD001	GV001	Chủ tịch
HD001	GV005	Phản biện 1
HD001	GV003	Phản biện 2
HD001	GV004	Thư ký
HD001	GV006	Ủy viên
HD002	GV002	Chu tich
\.


--
-- TOC entry 5036 (class 0 OID 16842)
-- Dependencies: 236
-- Data for Name: thanhvienthuchien; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.thanhvienthuchien (detaiid, sinhvienid) FROM stdin;
\.


--
-- TOC entry 5037 (class 0 OID 16845)
-- Dependencies: 237
-- Data for Name: topics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.topics (id, title, groupconsumerid, detaiid) FROM stdin;
118	Cập nhật thông tin đề tài	SnM2024009	DT2024009
119	Phân công hội đồng	BQL	DT2024009
120	Cập nhật thông tin đề tài	SnM2024010	DT2024010
121	Cập nhật thông tin đề tài	BQL	DT2024010
122	Cập nhật thông tin đề tài	BQL	DT2024010
123	Phân công hội đồng	BQL	DT2024010
116	Cập nhật thông tin đề tài	SnM2024008	DT2024008
117	Cập nhật thông tin đề tài	BQL	DT2024008
124	Cập nhật thông tin đề tài	SnM2024025	DT2024025
125	Cập nhật thông tin đề tài	BQL	DT2024025
126	Hội đồng chấm điểm	PCHD_HD001	DT2024025
127	Cập nhật thông tin đề tài	SnM2024026	DT2024026
128	Cập nhật thông tin đề tài	BQL	DT2024026
129	Hội đồng chấm điểm	PCHD_HD001	DT2024026
130	Cập nhật thông tin đề tài	SnM2024027	DT2024027
131	Phân công hội đồng	BQL	DT2024027
132	Cập nhật thông tin đề tài	SnM2024028	DT2024028
133	Cập nhật thông tin đề tài	BQL	DT2024028
134	Hội đồng chấm điểm	PCHD_HD001	DT2024028
135	Phê duyệt đề tài	SnM2024029	DT2024029
\.


--
-- TOC entry 5039 (class 0 OID 16851)
-- Dependencies: 239
-- Data for Name: unseenmsgs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unseenmsgs (taikhoanid, messagesid, time_stamp, topicid, _message) FROM stdin;
1	117	1730641117049	116	Sinh viên Nguyễn Văn F đã đăng ký đề tài Hệ thống Testing, yêu cầu phê duyệt đề tài.
2	118	1730641602120	116	Đề tài DT2024008 đã được giảng viên hướng dẫn phê duyệt
2	119	1730641602128	117	Đề tài DT2024008 đã được giảng viên hướng dẫn phê duyệt, yêu cầu phân công hội đồng phụ trách đề tài.
1	120	1730642407715	118	Sinh viên Nguyễn Văn F đã đăng ký đề tài Hệ thống Testing 03, yêu cầu phê duyệt đề tài.
9	121	1730642550231	118	Đề tài DT2024009 đã được giảng viên hướng dẫn phê duyệt
9	122	1730642550240	119	Đề tài DT2024009 đã được giảng viên hướng dẫn phê duyệt, yêu cầu phân công hội đồng phụ trách đề tài.
1	123	1730644329177	120	Sinh viên Nguyễn Văn F đã đăng ký đề tài Hệ thống Testing 123, yêu cầu phê duyệt đề tài.
9	124	1730645596626	120	Đề tài DT2024010 đã được giảng viên hướng dẫn phê duyệt
9	125	1730645596633	121	Đề tài DT2024010 đã được giảng viên hướng dẫn phê duyệt, yêu cầu phân công hội đồng phụ trách đề tài.
9	126	1730645670815	120	Đề tài DT2024010 đã được giảng viên hướng dẫn phê duyệt
9	127	1730645670819	122	Đề tài DT2024010 đã được giảng viên hướng dẫn phê duyệt, yêu cầu phân công hội đồng phụ trách đề tài.
9	128	1730645708298	120	Đề tài DT2024010 đã được giảng viên hướng dẫn phê duyệt
9	129	1730645708304	123	Đề tài DT2024010 đã được giảng viên hướng dẫn phê duyệt, yêu cầu phân công hội đồng phụ trách đề tài.
1	130	1730690400229	124	Sinh viên Nguyễn Văn F đã đăng ký đề tài OKLS 2323, yêu cầu phê duyệt đề tài.
9	131	1730691588919	124	Đề tài DT2024025 đã được giảng viên hướng dẫn phê duyệt
9	132	1730691588935	125	Đề tài DT2024025 đã được giảng viên hướng dẫn phê duyệt, yêu cầu phân công hội đồng phụ trách đề tài.
28	133	1730692278776	126	Đề tài DT2024025 được phân công cho hội đồng HD001, giờ đây bạn có thể xem đề tài.
1	134	1730707981420	127	Sinh viên Nguyễn Văn F đã đăng ký đề tài OKLS xxx, yêu cầu phê duyệt đề tài.
9	135	1730707987658	127	Đề tài DT2024026 đã được giảng viên hướng dẫn phê duyệt
9	136	1730707987662	128	Đề tài DT2024026 đã được giảng viên hướng dẫn phê duyệt, yêu cầu phân công hội đồng phụ trách đề tài.
28	137	1730708025666	129	Đề tài DT2024026 được phân công cho hội đồng HD001, giờ đây bạn có thể xem đề tài.
3	138	1730708183505	127	Đề tài DT2024026 đã được thành viên trong hội đồng chấm điểm, bây giờ bạn có thể xem bảng điểm và nhận xét và UPLOAD tài liệu thuyết minh (Sinh viên chủ nhiệm).
3	139	1730708200953	129	Đề tài DT2024026 đã được UPLOAD tài liệu thuyết minh, bây giờ bạn có thể xem (tải xuống), chấm điểm và nhận xét.
1	140	1730876247156	130	Sinh viên Nguyễn Văn F đã đăng ký đề tài OKLS23, yêu cầu phê duyệt đề tài.
9	141	1730876258948	130	Đề tài DT2024027 đã được giảng viên hướng dẫn phê duyệt
9	142	1730876258954	131	Đề tài DT2024027 đã được giảng viên hướng dẫn phê duyệt, yêu cầu phân công hội đồng phụ trách đề tài.
1	143	1731899724671	132	Sinh viên Nguyễn Văn F đã đăng ký đề tài System testing, yêu cầu phê duyệt đề tài.
2	144	1731899732869	132	Đề tài DT2024028 đã được giảng viên hướng dẫn phê duyệt
2	145	1731899732880	133	Đề tài DT2024028 đã được giảng viên hướng dẫn phê duyệt, yêu cầu phân công hội đồng phụ trách đề tài.
28	146	1731899754665	134	Đề tài DT2024028 được phân công cho hội đồng HD001, giờ đây bạn có thể xem đề tài.
1	147	1731913455789	135	Sinh viên Nguyễn Văn F đã đăng ký đề tài Hệ thống Testing, yêu cầu phê duyệt đề tài.
\.


--
-- TOC entry 5051 (class 0 OID 0)
-- Dependencies: 216
-- Name: baiviet_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.baiviet_id_seq', 1, true);


--
-- TOC entry 5052 (class 0 OID 0)
-- Dependencies: 226
-- Name: hoidong_hoidongid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hoidong_hoidongid_seq', 1, false);


--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 232
-- Name: taikhoan_taikhoanid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.taikhoan_taikhoanid_seq', 29, true);


--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 238
-- Name: topics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.topics_id_seq', 135, true);


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 240
-- Name: unseenmsgs_messagesid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.unseenmsgs_messagesid_seq', 147, true);


--
-- TOC entry 4789 (class 2606 OID 16862)
-- Name: baiviet baiviet_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.baiviet
    ADD CONSTRAINT baiviet_pkey PRIMARY KEY (id);


--
-- TOC entry 4791 (class 2606 OID 16864)
-- Name: bophanql bophanql_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bophanql
    ADD CONSTRAINT bophanql_pkey PRIMARY KEY (manql);


--
-- TOC entry 4793 (class 2606 OID 16866)
-- Name: consumers consumers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consumers
    ADD CONSTRAINT consumers_pkey PRIMARY KEY (taikhoanid, groupconsumerid);


--
-- TOC entry 4795 (class 2606 OID 16868)
-- Name: detai detai_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detai
    ADD CONSTRAINT detai_pkey PRIMARY KEY (detaiid);


--
-- TOC entry 4797 (class 2606 OID 16870)
-- Name: diemtailieubaocao diemtailieubaocao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diemtailieubaocao
    ADD CONSTRAINT diemtailieubaocao_pkey PRIMARY KEY (detaiid, nguoichamdiem);


--
-- TOC entry 4799 (class 2606 OID 16872)
-- Name: diemtailieudexuat diemtailieudexuat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diemtailieudexuat
    ADD CONSTRAINT diemtailieudexuat_pkey PRIMARY KEY (detaiid, nguoichamdiem);


--
-- TOC entry 4801 (class 2606 OID 16874)
-- Name: diemtailieuthuyetminh diemtailieuthuyetminh_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diemtailieuthuyetminh
    ADD CONSTRAINT diemtailieuthuyetminh_pkey PRIMARY KEY (detaiid, nguoichamdiem);


--
-- TOC entry 4803 (class 2606 OID 16876)
-- Name: giangvien giangvien_cccd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giangvien
    ADD CONSTRAINT giangvien_cccd_key UNIQUE (cccd);


--
-- TOC entry 4805 (class 2606 OID 16878)
-- Name: giangvien giangvien_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giangvien
    ADD CONSTRAINT giangvien_pkey PRIMARY KEY (giangvienid);


--
-- TOC entry 4807 (class 2606 OID 16880)
-- Name: groupconsumer groupconsumer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groupconsumer
    ADD CONSTRAINT groupconsumer_pkey PRIMARY KEY (groupconsumerid);


--
-- TOC entry 4809 (class 2606 OID 16882)
-- Name: hoidong hoidong_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hoidong
    ADD CONSTRAINT hoidong_pkey PRIMARY KEY (hoidongid);


--
-- TOC entry 4811 (class 2606 OID 16884)
-- Name: khoa khoa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.khoa
    ADD CONSTRAINT khoa_pkey PRIMARY KEY (khoaid);


--
-- TOC entry 4813 (class 2606 OID 16886)
-- Name: lop lop_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lop
    ADD CONSTRAINT lop_pkey PRIMARY KEY (lopid);


--
-- TOC entry 4815 (class 2606 OID 16888)
-- Name: seenmsgs seenmsgs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seenmsgs
    ADD CONSTRAINT seenmsgs_pkey PRIMARY KEY (taikhoanid, messagesid);


--
-- TOC entry 4817 (class 2606 OID 16890)
-- Name: sinhvien sinhvien_cccd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinhvien
    ADD CONSTRAINT sinhvien_cccd_key UNIQUE (cccd);


--
-- TOC entry 4819 (class 2606 OID 16892)
-- Name: sinhvien sinhvien_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinhvien
    ADD CONSTRAINT sinhvien_pkey PRIMARY KEY (sinhvienid);


--
-- TOC entry 4821 (class 2606 OID 16894)
-- Name: taikhoan taikhoan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taikhoan
    ADD CONSTRAINT taikhoan_pkey PRIMARY KEY (taikhoanid);


--
-- TOC entry 4823 (class 2606 OID 16896)
-- Name: taikhoan taikhoan_tendangnhap_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.taikhoan
    ADD CONSTRAINT taikhoan_tendangnhap_key UNIQUE (tendangnhap);


--
-- TOC entry 4825 (class 2606 OID 16898)
-- Name: tailieubaocao tailieubaocao_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tailieubaocao
    ADD CONSTRAINT tailieubaocao_pkey PRIMARY KEY (detaiid);


--
-- TOC entry 4827 (class 2606 OID 16900)
-- Name: tailieuthuyetminh tailieuthuyetminh_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tailieuthuyetminh
    ADD CONSTRAINT tailieuthuyetminh_pkey PRIMARY KEY (detaiid);


--
-- TOC entry 4829 (class 2606 OID 16902)
-- Name: thanhvienhd thanhvienhd_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thanhvienhd
    ADD CONSTRAINT thanhvienhd_pkey PRIMARY KEY (hoidongid, giangvienid);


--
-- TOC entry 4831 (class 2606 OID 16904)
-- Name: thanhvienthuchien thanhvienthuchien_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thanhvienthuchien
    ADD CONSTRAINT thanhvienthuchien_pkey PRIMARY KEY (detaiid, sinhvienid);


--
-- TOC entry 4833 (class 2606 OID 16906)
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- TOC entry 4835 (class 2606 OID 16908)
-- Name: unseenmsgs unseenmsgs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unseenmsgs
    ADD CONSTRAINT unseenmsgs_pkey PRIMARY KEY (messagesid);


--
-- TOC entry 4866 (class 2620 OID 16909)
-- Name: detai tg_autochangetitletopic; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_autochangetitletopic AFTER UPDATE ON public.detai FOR EACH ROW EXECUTE FUNCTION public.tg_autochangetitletopic();


--
-- TOC entry 4867 (class 2620 OID 16910)
-- Name: diemtailieubaocao tg_autocheckbaocao; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_autocheckbaocao AFTER INSERT ON public.diemtailieubaocao FOR EACH ROW EXECUTE FUNCTION public.tg_autocheckbaocao();


--
-- TOC entry 4869 (class 2620 OID 16911)
-- Name: diemtailieuthuyetminh tg_autocheckchamdiemthuyetminh; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_autocheckchamdiemthuyetminh AFTER INSERT ON public.diemtailieuthuyetminh FOR EACH ROW EXECUTE FUNCTION public.tg_autocheckchamdiemthuyetminh();


--
-- TOC entry 4868 (class 2620 OID 16912)
-- Name: diemtailieudexuat tg_autocheckduyetdexuat; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_autocheckduyetdexuat AFTER INSERT ON public.diemtailieudexuat FOR EACH ROW EXECUTE FUNCTION public.tg_autocheckduyetdexuat();


--
-- TOC entry 4870 (class 2620 OID 16913)
-- Name: taikhoan tg_autoinserttogroupconsumer; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_autoinserttogroupconsumer AFTER INSERT ON public.taikhoan FOR EACH ROW EXECUTE FUNCTION public.tg_autoinserttogroupconsumer();


--
-- TOC entry 4871 (class 2620 OID 16914)
-- Name: tailieubaocao tg_autoupdatestatusreportfile; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tg_autoupdatestatusreportfile AFTER INSERT ON public.tailieubaocao FOR EACH ROW EXECUTE FUNCTION public.tg_autoupdatestatusreportfile();


--
-- TOC entry 4836 (class 2606 OID 16915)
-- Name: bophanql bophanql_taikhoanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bophanql
    ADD CONSTRAINT bophanql_taikhoanid_fkey FOREIGN KEY (taikhoanid) REFERENCES public.taikhoan(taikhoanid);


--
-- TOC entry 4837 (class 2606 OID 16920)
-- Name: consumers consumers_groupconsumerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consumers
    ADD CONSTRAINT consumers_groupconsumerid_fkey FOREIGN KEY (groupconsumerid) REFERENCES public.groupconsumer(groupconsumerid);


--
-- TOC entry 4838 (class 2606 OID 16925)
-- Name: consumers consumers_taikhoanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consumers
    ADD CONSTRAINT consumers_taikhoanid_fkey FOREIGN KEY (taikhoanid) REFERENCES public.taikhoan(taikhoanid);


--
-- TOC entry 4839 (class 2606 OID 16930)
-- Name: detai detai_giangvienchunhiemid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detai
    ADD CONSTRAINT detai_giangvienchunhiemid_fkey FOREIGN KEY (giangvienchunhiemid) REFERENCES public.giangvien(giangvienid);


--
-- TOC entry 4840 (class 2606 OID 16935)
-- Name: detai detai_sinhvienid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detai
    ADD CONSTRAINT detai_sinhvienid_fkey FOREIGN KEY (sinhvienid) REFERENCES public.sinhvien(sinhvienid);


--
-- TOC entry 4842 (class 2606 OID 16940)
-- Name: diemtailieubaocao diemtailieubaocao_detaiid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diemtailieubaocao
    ADD CONSTRAINT diemtailieubaocao_detaiid_fkey FOREIGN KEY (detaiid) REFERENCES public.detai(detaiid);


--
-- TOC entry 4843 (class 2606 OID 16945)
-- Name: diemtailieubaocao diemtailieubaocao_nguoichamdiem_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diemtailieubaocao
    ADD CONSTRAINT diemtailieubaocao_nguoichamdiem_fkey FOREIGN KEY (nguoichamdiem) REFERENCES public.giangvien(giangvienid);


--
-- TOC entry 4844 (class 2606 OID 16950)
-- Name: diemtailieudexuat diemtailieudexuat_detaiid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diemtailieudexuat
    ADD CONSTRAINT diemtailieudexuat_detaiid_fkey FOREIGN KEY (detaiid) REFERENCES public.detai(detaiid);


--
-- TOC entry 4845 (class 2606 OID 16955)
-- Name: diemtailieudexuat diemtailieudexuat_nguoichamdiem_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diemtailieudexuat
    ADD CONSTRAINT diemtailieudexuat_nguoichamdiem_fkey FOREIGN KEY (nguoichamdiem) REFERENCES public.giangvien(giangvienid);


--
-- TOC entry 4846 (class 2606 OID 16960)
-- Name: diemtailieuthuyetminh diemtailieuthuyetminh_detaiid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diemtailieuthuyetminh
    ADD CONSTRAINT diemtailieuthuyetminh_detaiid_fkey FOREIGN KEY (detaiid) REFERENCES public.detai(detaiid);


--
-- TOC entry 4847 (class 2606 OID 16965)
-- Name: diemtailieuthuyetminh diemtailieuthuyetminh_nguoichamdiem_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diemtailieuthuyetminh
    ADD CONSTRAINT diemtailieuthuyetminh_nguoichamdiem_fkey FOREIGN KEY (nguoichamdiem) REFERENCES public.giangvien(giangvienid);


--
-- TOC entry 4841 (class 2606 OID 16970)
-- Name: detai fk_hoidongphancong; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.detai
    ADD CONSTRAINT fk_hoidongphancong FOREIGN KEY (hoidongphancong) REFERENCES public.hoidong(hoidongid);


--
-- TOC entry 4848 (class 2606 OID 16975)
-- Name: giangvien giangvien_khoaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giangvien
    ADD CONSTRAINT giangvien_khoaid_fkey FOREIGN KEY (khoaid) REFERENCES public.khoa(khoaid);


--
-- TOC entry 4849 (class 2606 OID 16980)
-- Name: giangvien giangvien_taikhoanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.giangvien
    ADD CONSTRAINT giangvien_taikhoanid_fkey FOREIGN KEY (taikhoanid) REFERENCES public.taikhoan(taikhoanid);


--
-- TOC entry 4850 (class 2606 OID 16985)
-- Name: lop lop_covan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lop
    ADD CONSTRAINT lop_covan_fkey FOREIGN KEY (covan) REFERENCES public.giangvien(giangvienid);


--
-- TOC entry 4851 (class 2606 OID 16990)
-- Name: lop lop_khoaid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lop
    ADD CONSTRAINT lop_khoaid_fkey FOREIGN KEY (khoaid) REFERENCES public.khoa(khoaid);


--
-- TOC entry 4852 (class 2606 OID 16995)
-- Name: seenmsgs seenmsgs_messagesid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seenmsgs
    ADD CONSTRAINT seenmsgs_messagesid_fkey FOREIGN KEY (messagesid) REFERENCES public.unseenmsgs(messagesid);


--
-- TOC entry 4853 (class 2606 OID 17000)
-- Name: seenmsgs seenmsgs_taikhoanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seenmsgs
    ADD CONSTRAINT seenmsgs_taikhoanid_fkey FOREIGN KEY (taikhoanid) REFERENCES public.taikhoan(taikhoanid);


--
-- TOC entry 4854 (class 2606 OID 17005)
-- Name: sinhvien sinhvien_lopid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinhvien
    ADD CONSTRAINT sinhvien_lopid_fkey FOREIGN KEY (lopid) REFERENCES public.lop(lopid);


--
-- TOC entry 4855 (class 2606 OID 17010)
-- Name: sinhvien sinhvien_taikhoanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sinhvien
    ADD CONSTRAINT sinhvien_taikhoanid_fkey FOREIGN KEY (taikhoanid) REFERENCES public.taikhoan(taikhoanid);


--
-- TOC entry 4856 (class 2606 OID 17015)
-- Name: tailieubaocao tailieubaocao_detaiid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tailieubaocao
    ADD CONSTRAINT tailieubaocao_detaiid_fkey FOREIGN KEY (detaiid) REFERENCES public.detai(detaiid);


--
-- TOC entry 4857 (class 2606 OID 17020)
-- Name: tailieuthuyetminh tailieuthuyetminh_detaiid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tailieuthuyetminh
    ADD CONSTRAINT tailieuthuyetminh_detaiid_fkey FOREIGN KEY (detaiid) REFERENCES public.detai(detaiid);


--
-- TOC entry 4858 (class 2606 OID 17025)
-- Name: thanhvienhd thanhvienhd_giangvienid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thanhvienhd
    ADD CONSTRAINT thanhvienhd_giangvienid_fkey FOREIGN KEY (giangvienid) REFERENCES public.giangvien(giangvienid);


--
-- TOC entry 4859 (class 2606 OID 17030)
-- Name: thanhvienhd thanhvienhd_hoidongid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thanhvienhd
    ADD CONSTRAINT thanhvienhd_hoidongid_fkey FOREIGN KEY (hoidongid) REFERENCES public.hoidong(hoidongid);


--
-- TOC entry 4860 (class 2606 OID 17035)
-- Name: thanhvienthuchien thanhvienthuchien_detaiid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thanhvienthuchien
    ADD CONSTRAINT thanhvienthuchien_detaiid_fkey FOREIGN KEY (detaiid) REFERENCES public.detai(detaiid);


--
-- TOC entry 4861 (class 2606 OID 17040)
-- Name: thanhvienthuchien thanhvienthuchien_sinhvienid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.thanhvienthuchien
    ADD CONSTRAINT thanhvienthuchien_sinhvienid_fkey FOREIGN KEY (sinhvienid) REFERENCES public.sinhvien(sinhvienid);


--
-- TOC entry 4862 (class 2606 OID 17045)
-- Name: topics topics_detaiid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_detaiid_fkey FOREIGN KEY (detaiid) REFERENCES public.detai(detaiid);


--
-- TOC entry 4863 (class 2606 OID 17050)
-- Name: topics topics_groupconsumerid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_groupconsumerid_fkey FOREIGN KEY (groupconsumerid) REFERENCES public.groupconsumer(groupconsumerid);


--
-- TOC entry 4864 (class 2606 OID 17055)
-- Name: unseenmsgs unseenmsgs_taikhoanid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unseenmsgs
    ADD CONSTRAINT unseenmsgs_taikhoanid_fkey FOREIGN KEY (taikhoanid) REFERENCES public.taikhoan(taikhoanid);


--
-- TOC entry 4865 (class 2606 OID 17060)
-- Name: unseenmsgs unseenmsgs_topicid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unseenmsgs
    ADD CONSTRAINT unseenmsgs_topicid_fkey FOREIGN KEY (topicid) REFERENCES public.topics(id);


-- Completed on 2024-11-26 00:41:22

--
-- PostgreSQL database dump complete
--

