const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// ملف تخزين الإعلانات
const ADS_FILE = path.join(__dirname, 'ads.json');

// تهيئة ملف الإعلانات إذا لم يكن موجوداً
if (!fs.existsSync(ADS_FILE)) {
    fs.writeFileSync(ADS_FILE, JSON.stringify([]));
}

// قراءة الإعلانات
function readAds() {
    const data = fs.readFileSync(ADS_FILE);
    return JSON.parse(data);
}

// حفظ الإعلانات
function writeAds(ads) {
    fs.writeFileSync(ADS_FILE, JSON.stringify(ads, null, 2));
}

// API: الحصول على جميع الإعلانات
app.get('/api/ads', (req, res) => {
    const ads = readAds();
    res.json(ads);
});

// API: إضافة إعلان جديد
app.post('/api/ads', (req, res) => {
    const ads = readAds();
    const newAd = req.body;
    ads.push(newAd);
    writeAds(ads);
    res.status(201).json(newAd);
});

// API: حذف إعلان
app.delete('/api/ads/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let ads = readAds();
    ads = ads.filter(ad => ad.id !== id);
    writeAds(ads);
    res.status(200).json({ message: 'تم الحذف بنجاح' });
});

// تشغيل الخادم
app.listen(PORT, () => {
    console.log(`🚀 الخادم يعمل على http://localhost:${PORT}`);
    console.log(`🔐 معلومات الدخول للوحة الإدارة:`);
    console.log(`   المستخدم: admin`);
    console.log(`   كلمة المرور: admin123`);
});
