<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{name}}</title>
    <link rel="stylesheet" href="/static/normalize.css">
    <link href="/static/logo.png" rel="icon" type="image/x-icon">
</head>
<body>
    <h1>page1</h1>
    <input id="env" value="{{env}}" style="display: none;">
    <input id="options" value="{{options}}" style="display: none;">
    <button onclick="handleClick()">get List</button>
    <script src="https:/cdn.bootcss.com/axios/0.18.0/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
    <script type="text/javascript">
        try{
            window.env = document.getElementById('env').value;
            const options = document.getElementById('options').value;
            window.options = JSON.parse(options);
        }catch(e){
            console.error(e);
        }

        const handleClick = () => {
            const signKey = 'adsefdrgfhjvgcxfbds34er5thy'
            const st = Date.now()

            axios.request({
                method:'get',
                url:'/api/project/list',
                params:{
                    proj_key:'1111'
                }, 
                headers: {
                    s_t:st,
                    s_sign: md5(`${signKey}_${st}`),
                }
            })
        }
    </script>
</body>
</html>