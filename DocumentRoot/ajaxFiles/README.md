This folder consists of php files that are meant to be called asynchronously by AJAX from users' browsers.
They all interact with the database and let the users know how the interaction went.
They're all fairly short, relying on the helper file ajaxCheck.php, which handles security issues that all operations dealing with tabs should account for
Use with the ajaxCall() function found in DocumentRoot/general.js
