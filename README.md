# PM Station Project - Website

เว็บไซต์ของโครงการวิทยุเสียงตามสาย PM Station โดยคณะกรรมการนักเรียนฝ่ายเทคโนโลยีสารสนเทศ โรงเรียนมัธยมสาธิตวัดพระศรีมหาธาตุ มหาวิทยาลัยราชภัฏพระนคร

> เว็บไซต์โครงการนี้อยู่ระหว่างการปรับปรุงระบบและส่งต่อไปยังรุ่นถัดไป อาจเกิดข้อผิดพลาดจากความไม่เสถียร และฟีเจอร์ที่ไม่ครบถ้วน
> หากต้องการดูเว็บไซต์ของปีการศึกษา 2565 สามารถดูได้ที่ Branch `legacy`

![PM Station Songrequests Search Screenshot](screenshots/pm-station-songrequests-search.png)

## การเข้าถึง (Access)

สามารถติดตามรายละเอียดเกี่ยวกับโครงการและเข้าสู่เว็บไซต์ได้ทาง [IG @coolkidssatit](https://instagram.com/coolkidssatit/)

## โครงสร้างของโครงการ (Project Structure)

โครงการนี้มีลักษณะเป็น Monorepo ที่ประกอบด้วยแพ็คเกจ (Package) หลายแพ็คเกจใน Repository เดียว โดยโดยโฟลเดอร์ที่สำคัญประกอบด้วย

1. `apps` เป็นโฟลเดอร์สำหรับเว็บไซต์และแอปพลิเคชั่นทั้งหมดของโครงการนี้
    * `website` เว็บไซต์หลักของโครงการ
    * `kiosk-web` เว็บไซต์เสริมสำหรับรายงานสถานะการจัดรายการแบบ Real Time
2. `packages` เป็นโฟลเดอร์สำหรับโค้ดที่ใช้ร่วมกันภายในเว็บไซต์ โดยแบ่งออกเป็นแพ็คเกจย่อย ๆ เพื่อความเป็นระเบียบและความสะดวกในการใช้งาน

## ลิขสิทธิ์ (License)

MIT
