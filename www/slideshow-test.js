var fileExt = {};
fileExt[0]=".png",
fileExt[1]=".jpg",
fileExt[2]=".gif";

$.ajax({
    //This will retrieve the contents of the folder if the folder is configured as 'browsable'
    url: 'local/images/',
    success: function (data) {
       //List all png or jpg or gif file names in the page
       $(data).find("a:contains(" + fileExt[0] + "),a:contains(" + fileExt[1] + "),a:contains(" + fileExt[2] + ")").each(function () {
           var filename = this.href.replace(window.location.host, "").replace("http:///", "");
           // $("#fileNames").append( "<li>" + filename + "</li>");
           console.log(filename);
           console.log(this);
       });
       // $("#fileNames").append('</ul>');
     }
  });
