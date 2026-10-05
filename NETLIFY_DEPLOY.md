# 🌺 কলেজ পাড়া সার্বজনীন দুর্গাপূজা — Netlify Deployment Guide

এই প্রকল্পটি **Netlify**-এ ডেপ্লয় করার জন্য সম্পূর্ণ প্রস্তুত।

---

## ⚡ Option 1: Netlify Drag & Drop (সবচেয়ে দ্রুত ও সহজ - কোনো গিটের প্রয়োজন নেই)

1. আপনার লোকাল ফোল্ডারে ব্রাউজারে তৈরি থাকা ফোল্ডারটি দেখুন:
   `D:\College para\durga-puja-website\dist`
2. ব্রাউজারে [app.netlify.com/drop](https://app.netlify.com/drop)-এ যান (লগইন করা না থাকলে লগইন করুন)।
3. সরাসরি `dist` ফোল্ডারটি টেনে এনে (Drag & Drop) ব্রাউজারের উইন্ডোতে ছেড়ে দিন।
4. মাত্র কয়েক সেকেন্ডের মধ্যেই আপনার দুর্গাপূজা ৩ডি ওয়েবসাইট লাইভ হয়ে যাবে!

---

## ⚡ Option 2: Git Repository দিয়ে ডেপ্লয় (GitHub / GitLab / Bitbucket)

1. প্রজেক্টটি GitHub-এ পুশ করুন।
2. [app.netlify.com](https://app.netlify.com)-এ গিয়ে **"Add new site"** ➔ **"Import an existing project"** ক্লিক করুন।
3. GitHub সিলেক্ট করে আপনার রিপোজিটরিটি বেছে নিন।
4. Netlify স্বয়ংক্রিয়ভাবে `netlify.toml` ফাইলটি পড়ে নেবে:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node.js version:** `20`
5. **"Deploy site"** বোতামে ক্লিক করুন!

---

## ⚡ Option 3: Netlify CLI দিয়ে টার্মিনাল থেকে ডেপ্লয়

প্রজেক্ট ফোল্ডারে টার্মিনাল খুলে চালান:

```bash
npx netlify deploy --prod --dir=dist
```

---

## 🛠️ প্রোজেক্টে অন্তর্ভুক্ত Netlify কনফিগারেশন

- **`netlify.toml`**: স্বয়ংক্রিয় বিল্ড কমান্ড, নোড ২০ রানটাইম এনভায়রনমেন্ট, এবং অ্যাসেট ক্যাশিং হেডার্স।
- **`public/_redirects` & `dist/_redirects`**: সম্পূর্ণ SPA ক্লায়েন্ট-সাইড রাউটিং সাপোর্ট (`/*  /index.html  200`), যা যেকোনো পেজে রিফ্রেশ দিলে 404 এরর আসা প্রতিরোধ করে।
