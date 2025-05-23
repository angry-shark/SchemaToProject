<!DOCTYPE html>
<html lang="en" class="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{name}}</title>
</head>

<body style="margin: 0;">
    <div id="root"></div>
    <input id="projKey" value="{{projKey}}" style="display: none;">
    <input id="env" value="{{env}}" style="display: none;">
    <input id="options" value="{{options}}" style="display: none;">
</body>
<script type="text/javascript">
    try {
        window.projKey = document.getElementById('projKey').value;
        window.env = document.getElementById('env').value;
        const options = document.getElementById('options').value;
        window.options = JSON.parse(options);
    } catch (e) {
        console.error(e);
    }
</script>

</html>