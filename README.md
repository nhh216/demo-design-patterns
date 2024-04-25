API Post User E-KYC form
---------------------
```
curl --location 'localhost:3456/api/v1/user-ekyc' \
--header 'Content-Type: application/json' \
--data '{
    "fullName": "Quia minus ut ut id ipsam id iusto repudiandae at.",
    "birthDate": "2048-01-24T12:00:54.741Z",
    "address": "Magnam quasi eligendi omnis ut aut voluptatem non minus.",
    "identityNumber": "Aut aspernatur enim cum quo voluptate voluptas cum dignissimos.",
    "identityFrontImage": "identityFrontImage.png",
    "identityBackImage": "identityBackImage.png",
    "selfieImage": ["selfieImage1.png", "selfieImage2.png", "selfieImage1.png"],
    "status": "submitted"
  }'
```
