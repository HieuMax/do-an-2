PGDMP                   	    |            doan2    16.1    16.1     �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    24584    doan2    DATABASE     �   CREATE DATABASE doan2 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE doan2;
                postgres    false            �          0    24762    bangdiemdetai 
   TABLE DATA           6   COPY public.bangdiemdetai (detaiid, diem) FROM stdin;
    public          postgres    false    228   �       �          0    24772    bangdiemthanhphan 
   TABLE DATA           }   COPY public.bangdiemthanhphan (detaiid, hoidongid, vaitro, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6) FROM stdin;
    public          postgres    false    229          �          0    24604    bophanql 
   TABLE DATA           S   COPY public.bophanql (manql, tennql, sdt, mail, tenbophan, taikhoanid) FROM stdin;
    public          postgres    false    217   *       �          0    61647 	   consumers 
   TABLE DATA           @   COPY public.consumers (groupconsumerid, taikhoanid) FROM stdin;
    public          postgres    false    233   �       �          0    24700    detai 
   TABLE DATA           �   COPY public.detai (detaiid, tendetai, linhvuc, kinhphi, trangthai, thoigianthuchien, ngaybatdau, tailieudexuat, giangvienchunhiemid, sinhvienid, hoidongphancong, originalfilename) FROM stdin;
    public          postgres    false    225   	       �          0    61617    diemtailieudexuat 
   TABLE DATA           �   COPY public.diemtailieudexuat (detaiid, nguoichamdiem, nhanxet, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6, diemtc7, diemtc8, diemtailieu) FROM stdin;
    public          postgres    false    231   <       �          0    62428    diemtailieuthuyetminh 
   TABLE DATA           �   COPY public.diemtailieuthuyetminh (nguoichamdiem, diemtailieu, nhanxet, detaiid, diemtc1, diemtc2, diemtc3, diemtc4, diemtc5, diemtc6, diemtc7, diemtc8) FROM stdin;
    public          postgres    false    239   �       �          0    24621 	   giangvien 
   TABLE DATA           �   COPY public.giangvien (giangvienid, hoten, hocham, hocvi, mail, tennh, stknh, cccd, gioitinh, ngaysinh, khoaid, taikhoanid, sdt) FROM stdin;
    public          postgres    false    219   e       �          0    61640    groupconsumer 
   TABLE DATA           D   COPY public.groupconsumer (groupconsumerid, name_group) FROM stdin;
    public          postgres    false    232   �       �          0    24677    hoidong 
   TABLE DATA           >   COPY public.hoidong (hoidongid, tenhoidong, mota) FROM stdin;
    public          postgres    false    223   {       �          0    24616    khoa 
   TABLE DATA           /   COPY public.khoa (khoaid, tenkhoa) FROM stdin;
    public          postgres    false    218   �       �          0    24641    lop 
   TABLE DATA           ;   COPY public.lop (lopid, tenlop, covan, khoaid) FROM stdin;
    public          postgres    false    220   `        �          0    62074    seenmsgs 
   TABLE DATA           @   COPY public.seenmsgs (taikhoanid, messagesid, seen) FROM stdin;
    public          postgres    false    238   �        �          0    24656    sinhvien 
   TABLE DATA           v   COPY public.sinhvien (sinhvienid, hoten, mail, tennh, stknh, cccd, gioitinh, ngaysinh, taikhoanid, lopid) FROM stdin;
    public          postgres    false    221   !       �          0    24593    taikhoan 
   TABLE DATA           Y   COPY public.taikhoan (taikhoanid, tendangnhap, matkhau, vaitro, "webSocket") FROM stdin;
    public          postgres    false    216   �!       �          0    24750    tailieubaocao 
   TABLE DATA           H   COPY public.tailieubaocao (detaiid, tailieubaocao, ngaynop) FROM stdin;
    public          postgres    false    227   W"       �          0    61567    tailieuthuyetminh 
   TABLE DATA           \   COPY public.tailieuthuyetminh (tailieupath, detaiid, ngaynop, originalfilename) FROM stdin;
    public          postgres    false    230   t"       �          0    24685    thanhvienhd 
   TABLE DATA           E   COPY public.thanhvienhd (hoidongid, giangvienid, vaitro) FROM stdin;
    public          postgres    false    224   �"       �          0    24723    thanhvienthuchien 
   TABLE DATA           @   COPY public.thanhvienthuchien (detaiid, sinhvienid) FROM stdin;
    public          postgres    false    226   ]#       �          0    61689    topics 
   TABLE DATA           E   COPY public.topics (id, title, groupconsumerid, detaiid) FROM stdin;
    public          postgres    false    235   z#       �          0    62050 
   unseenmsgs 
   TABLE DATA           [   COPY public.unseenmsgs (taikhoanid, messagesid, time_stamp, topicid, _message) FROM stdin;
    public          postgres    false    237   $       �           0    0    hoidong_hoidongid_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.hoidong_hoidongid_seq', 1, false);
          public          postgres    false    222            �           0    0    taikhoan_taikhoanid_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.taikhoan_taikhoanid_seq', 28, true);
          public          postgres    false    215            �           0    0    topics_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.topics_id_seq', 60, true);
          public          postgres    false    234            �           0    0    unseenmsgs_messagesid_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.unseenmsgs_messagesid_seq', 21, true);
          public          postgres    false    236            �      x������ � �      �      x������ � �      �   q   x�s
000�tJ�S,}�kq����
���F�&�f���I�9����9�z����Nw�T�x�km��#�1��#�>
F�`�斦& �F�Z��
�8�,�b���� B&K      �   N   x��p1202100�4���l#NS$6B�I�1��	��	��)��)����P�)Ї�LY�%̑���qqq r%!�      �   #  x�}ROo�0??>E��a佶RzTIvS&�'�n$�2þ�J��� y��%J8r�( �>W�Ȗe�9�Y<��"I��p�}��HqJ��}/_�jxM	bw'X����E-�����#.v��k
���-��,*������ב��6:esj�<tr'�����P��o쉞�u�d��z�����a�7s����y��w�ܴ�7��oc�!��O����j^��j�+����h�-�x"j ��]n�%z�N�#lǨq�b;��g돬2��f�9WY��(��7��y?P�i      �   �   x�m���0Dg�+��q��:0tAL�L��~��6B�.'��:OW�"��[�HQ~�x��,�t@��ˁ,5ҙ�;6�����;3X7�	,��&��q�a~}0��ť���\��u�`��e�������ߛ�64      �      x�]�1�0E�S��ub��H:d��� ���=q�V)����N���p[�8M��|J�;�Є�DQ�:J�z�ZP-�Uk����Zz33�=�6�{'a}_�Ӟg����o�)      �   Y  x�]��N�@�קO1/@3��m��`QSIh�&l���(ըXW>�n�&� ,�E�&����g�6����3���r���ol_+ry�I��(������=^�����x�B'�s`\$Rico�q����-�p ul�g�������?ի���b�NΝ�S�I5�|VP��4li�h%�ٱK s.٢ǹ8H��X<�'�K���'��@�{R�h������RI(��J),%w�%�^�0CO���Y<��A-���C���o��Q��r��k�)�������$�7r��$�s\���r&�+H�%�w�����-�Ċc��U�� ��*.u4��(�:m��      �   �   x��p10����TH��KW00�r�p�t�|�k1�_�yxU�BƱw�rS�Z����b`��ň�)Ї3 ��& ���Q!��^�2##���LS82���F���2\B�:�z�H�k�kL�^c�^����������׌d�fp��$�5����� �H�j      �   \   x�3��x�{f��wO�KW0D��xxa^�Bz��
)woT r��Д��j3�2FS��Ǫ͘�M:�6.S4e�|��L�b���� #(�      �   i   x��600����OTp>�%/]�/=���v��0/$3�������;3/C!��� 1c��_z��]3�����A�&q�҇�֖�L!�+�<ܽ4�+F��� �5,8      �   W   x��100��y�{v���_H���\>FPI� .e�2�J���p)c��	T����dL@2�Pw .e����� �d$�      �   H   x�%���0�K1��W/~������hD��g��$�� 1R��S^m��<����
ΌKы����1���      �   �   x�]�;
�@F���*�Ý�<;AP�0M�T6"1)LE�Z�\��L��N�5�
��8i�,��cۜk'{�jgH����f�z���UEc-i%ߋ���Ҟ�Q�2$&��=��$%�D
U�ݴ�k�زm.�h�N,�
뛌����yoR}HM���=���?�1�=p�qwK��P��+�x]�A�      �   d   x�3�LL��̃��`2�˔3���Ӑ3$519#�(b1D1������� EL�"F("f@]�(�́"&("@SK�����(�Cc���� �2�      �      x������ � �      �   S   x�347��014#�4���4N�##CNC+#+Sc]#S}K}�8����BxFfI�S~�BHjqIf^:HW� �|      �   v   x�3�t300�t�x�{�B�����\�`ACTAC��16A#·��U*�e^���w-�K��*d�x
I�w��)BU�p�d۠�}x�B2�ql!P}I��5y0�M�c����� �[LG      �      x������ � �      �   �   x�35��8�J!�������#�nT(9� ������������%��25&���܈�Ԅ�rc�rc.SS��M��M�L�*7�+7�25'���܌���|Q�B��-y�
w��뙜���胬Ԓ���p��\fD�l����� I��1      �   �  x����j�@�ϫ��aw��ѥ�\\(�)���I�C)���TzicJ���ГMO2y�Ig�Xu����~�ofw3LX��+˝��id�4K�:-�'�r�!���}G��\��F�!\�\�B^|O�?��߾��q�����	�����I1��0��|�����(�S���TM��rT��-��\�b��bF	6��������	-̭	���%d~ P��LS3���q�C�Ml�)����F#y�n<_�{M�)D�Arkt�P�)�h�ᩝ��L�v�����z�b[-��=�FOB҂3Y�L�=�NN_�����+�E��i�7G��5��Qۚ���#BJ���a� �B+Ǵ��w���4)�_�uI��hLß�_?��y{�6!�i����7�u�V#�"ڶ:D�)�m�;EK��Nm�pvE�?{&r     