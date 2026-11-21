# US Bookkeeping Certification Test

ონლაინ ტესტი ბუღალტრული აღრიცხვიდან: Xero, QuickBooks Online, აშშ-ის საგადასახადო სისტემა, ბიზნეს ფორმები და GAAP.

- 21 კითხვა, 30 წუთიანი ტაიმერი, გასავლელი ზღვარი 70%
- შედეგების მიმოხილვა სწორი პასუხებით
- სერტიფიკატი ჩაბარების შემთხვევაში (ბეჭდვა / Save as PDF, LinkedIn-ზე გაზიარება)

## გამოქვეყნება GitHub Pages-ზე
1. შექმენით რეპოზიტორია `TEST` და ატვირთეთ `index.html` (ან `git push`).
2. Settings → Pages → Source: `Deploy from a branch`, Branch: `main` / `(root)`.
3. საიტი: https://<username>.github.io/TEST/

## კონფიგურაცია
`index.html`-ში `CONFIG` ობიექტი: დრო, გასავლელი ზღვარი, ინსტრუქტორის სახელი, LinkedIn-ის ტექსტი.

ყველა მონაცემი მუშაობს ბრაუზერში; სერვერი არ არის საჭირო.

## სერტიფიკატის გაგზავნა მეილზე
GitHub Pages სტატიკური ჰოსტინგია და მეილს ვერ გააგზავნის, ამიტომ გამოიყენება Google Apps Script:

1. https://script.google.com → New project → ჩასვით `apps-script/Code.gs`-ის შიგთავსი.
2. Deploy → New deployment → Type: **Web app** · Execute as: **Me** · Who has access: **Anyone**.
3. დააკოპირეთ Web app URL და ჩასვით `index.html`-ში → `CONFIG.certEndpoint`.
4. ჩააბარეთ ტესტი — სერტიფიკატი PDF-ად გაიგზავნება მოცემულ მეილზე.

შენიშვნა: ქულას ბრაუზერი აგზავნის, ამიტომ სერვერი მხოლოდ ამოწმებს, რომ ქულა ≥ 70%-ია. Gmail-ს აქვს დღიური ლიმიტი (უფასო ანგარიშზე დაახლოებით 100 მეილი დღეში).
