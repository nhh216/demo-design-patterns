https://www.freecodecamp.org/news/a-quick-introduction-to-clean-architecture-990c014448d2/
*   Phát triển tính năng user EKYC để xác thực danh tính của user tăng độ tin cậy cho các hợp đồng và các dịch vụ tài chính.
    Yêu cầu:
* Cho phép user điền thông tin vào form xác thực yêu cầu khai những thông tin cá nhân như tên , ngày tháng năm sinh, đia chỉ và cung cấp hình ảnh đầy đủ các góc cạnh của khuôn mặt và ảnh mặt trước, mặt sau căn cước công dân
* User có thể save draft nếu chưa điền đủ thông tin
* EKYC form reqeuire toàn bộ các trường thông tin nếu user chọn submit form
* Hệ thống tiếp nhận EKYC form lưu vào DB , cập nhật user ekyc status sang pending và chuyển tiếp thông tin cho bên dịch vụ EKYC để xác thực
* Hệ thống nhận respone từ phía EKYC service và update status cho EKYC form đồng thời lưu log request và response tới EKYC 3rd party service 
* Nếu tỷ lệ trùng khớp trên 95% -> hệ thống cập nhật trạng thái Verified cho EKYC form và user ekyc status, đồng thời send notification cho user
+ Nếu tỉ lệ trùng khớp nhỏ hơn 95% hoặc có lỗi từ phía EKYC service thì cập nhật EKYC form status -> Failed, đồng thời send notification cho user
* Trường hợp Failed có thể được admin phê duyệt thủ công, nếu phê duyệt thì sẽ chuyển status sang Verified nếu reject thì sẽ chuyển sang Rejected
