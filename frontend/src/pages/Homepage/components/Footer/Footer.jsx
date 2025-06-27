import React from "react";
import "./Footer.style.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <a href="#">이용 약관</a>
        <a href="#">개인정보</a>
        <a href="#">법적 고지</a>
        <a href="#">쿠키 설정</a>
        <a href="#">회사 정보</a>
        
      </div>
      <p className="footer-info">
        플릭스코리아 유한회사 통신판매업신고번호: 제20-서울강북-1234호 전화번호:
        010-9223-6828(수신자 부담)<br />
        이름 : 안성준<br />
        이메일 주소: dksrkdms545@gmail.com<br />
        주소: 대한민국 서울특별시 강북구 번동 348-1 306호 우편번호 01144<br />
        사업자등록번호: 123-45-67890<br />
      </p>
    </footer>
  );
};

export default Footer;
