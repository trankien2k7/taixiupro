var express = require("express");
var socketIO = require("socket.io");
var request = require('request');
var path = require("path");
var PORT = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
var INDEX = path.join(__dirname, "index.html");
var server = express()
        .use((req, res) => res.sendFile(INDEX))
        .listen(PORT, () => console.log(`Listening on ${PORT}`));
var io = socketIO(server,
{
        pingInterval: 5000,
        pingTimeout: 5000,
        cookie: false
});
var cuoc   = Array();
var system = {
	url : 'https://demo1.cardvip365.com', 
	keycode : '123456', 
	ngocrong_min : 1000, 
	ngocrong_max : 2000,
	baucua_min : 1000, 
	baucua_max : 2000, 	
	cancua : 1,
	chanle_max : 1000,
	chanle_min : 1500,
	time : 60000,
	load : 15000,
	bot_ngocrong : 0,
	bot_chanle : 0,
	bot_baucua : 0,

	};

var game = 
{ 
	id : 0,
	t  : 0,
	x  : 0,
	at : 0,
	ax : 0,
	b  : 0,
	a  : 0,
	bc1 : 0,
	bc2 : 0,
	bc3 : 0,
	bc4 : 0,
	bc5 : 0,
	bc6 : 0,
	time : 0,
	trangthai : '',
	x1 : 0,
	x2 : 0,
	x3 : 0,
	b1 : 0,
	b2 : 0,
	b3 : 0,
	c1 : -1,
	c2 : -1,
	c3 : -1,
	c4 : -1,
	c5 : -1,
	send : 0,
	load : 0,
	chanle : '0,0,0,0,0,0',
};
function thoigian()
{
	return Date.now()+system.time;
}
function tron(num, digits) 
{
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "k" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "G" },
    { value: 1E12, symbol: "T" },
    { value: 1E15, symbol: "P" },
    { value: 1E18, symbol: "E" }
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function rand(min, max) 
{
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
//eee
function idphien()
{
	console.log(system.url);
	if(game.load !=0) return false;
	game.load=1;
	request.post(
	{
		headers:
		{
			'content-type': 'application/x-www-form-urlencoded',
		},
		url  : system.url+'/websocket/game.html',
		body : "getgame=true",
		},(err, res, body) =>
		{
			body = JSON.parse(body);
			game.id   = +body.id;
			game.load = 0;
			system.cancua = +body.cancua;
			system.ngocrong_min = +body.bot_ngocrong_cuoc_min;
			system.ngocrong_max = +body.bot_ngocrong_cuoc_max;
			system.chanle_min = +body.bot_chanle_cuoc_min;
			system.chanle_max = +body.bot_chanle_cuoc_max;
			system.baucua_min = +body.bot_baucua_cuoc_min;
			system.baucua_max = +body.bot_baucua_cuoc_max;			
			system.time			= +body.thoigian;
			system.load			= +body.thoigiancho;
			system.bot_ngocrong = +body.bot_ngocrong;
			system.bot_chanle = +body.bot_chanle;
			system.bot_baucua = +body.bot_baucua;
			
			taophien();
		}
		);
}

function sendgame()
{
	if(game.send !=0) return false;
	game.send=1;
	request.post(
	{
		headers:
		{
			'content-type': 'application/x-www-form-urlencoded',
		},
		url  : system.url+'/websocket/socket.io.html',
		body : "key="+system.keycode+"&sendgame=true&game="+JSON.stringify(game)+"&cuoc="+JSON.stringify(cuoc)+"",
		},(err, res, body) =>
		{
			
			game.send = 1;
      console.log(body); 
		}
		);
}

function taophien()
{
	game.id+=1;
	game.t = 0;
	game.x = 0;
	game.at =0;
	game.ax = 0;
	game.b  = +thoigian();
	game.a  = 0;
	game.bc1 = 0;
	game.bc2 = 0;
	game.bc3 = 0;
	game.bc4 = 0;
	game.bc5 = 0;
	game.bc6 = 0;
	game.trangthai = 'dangchay';
	game.x1  = 0;
	game.x2  = 0;
	game.x3  = 0;
	game.b1  = 0;
	game.b2  = 0;
	game.b3  = 0;
	game.c1 = game.c2 = game.c3 = game.c4 = game.c5 = -1;
	game.send = 0;
	game.chanle = '0,0,0,0,0,0';
	cuoc.slice(0).forEach(function(item)
	{
		cuoc.splice(cuoc.indexOf(item), 1);
	});
	console.log('Tao phien :'+game.id);
	
}


function tiencuoc(id,value)
{
	var dn = 0;
	for(var i =0; i<cuoc.length;i++)
	{
		if(cuoc[i].type == value && cuoc[i].id == id)
		{
			dn+= cuoc[i].xu;
		}
	}
	return dn;
}



function checknguoi(type)
{
	for(var i=0;i<cuoc.length;i++)
	{
    if(cuoc[i].game == 'taixiu' && cuoc[i].type == type  && cuoc[i].id >=1)
		{
			return cuoc[i];
		}
    
		
	}
	return 0;
}

function cuoctaixiu(type)
{
	for(var i=cuoc.length-1;i>-1;i--)
	{
    if(cuoc[i].game == 'taixiu' && cuoc[i].type == type && cuoc[i].xu >0 && cuoc[i].id >=1)
		{
			return cuoc[i];
		}
    
		if(cuoc[i].game == 'taixiu' && cuoc[i].type == type && cuoc[i].xu >0)
		{
			return cuoc[i];
		}
	}
	return null;
}

function users(id,type)
{
	for(var i=0;i<cuoc.length;i++)
	{
		if(cuoc[i].id == id && cuoc[i].type == type)
		{
			return cuoc[i];
		}
	}
	return false;
}
		
function chanle()
{
	if(system.bot_chanle >=1) return false;
	var xu = rand(system.chanle_min,system.chanle_max);
	var tiencuocgoc = game.chanle.split(",");
	var v1 = +tiencuocgoc[0];
	var v2 = +tiencuocgoc[1];
	var v3 = +tiencuocgoc[2];
	var v4 = +tiencuocgoc[3];
	var v5 = +tiencuocgoc[4];
	var v6 = +tiencuocgoc[5];
	var nul = rand(1,6);
	if(nul == 1) v1+=+xu;
	else if(nul == 2) v2+=+xu;
	else if(nul == 3) v3+=+xu;
	else if(nul == 4) v4+=+xu;
	else if(nul == 5) v5+=+xu;
	else  v6+=+xu;
	game.chanle = ''+v1+','+v2+','+v3+','+v4+','+v5+','+v6+'';
}
function auto()
{
	if(system.bot_ngocrong >=1) return false;
	var xu  = rand(system.ngocrong_min,system.ngocrong_max);
	var ty = rand(1,18) <=10 ? 'tai' : 'xiu';
	var randbot = rand(1,5);

var soluongbot = 1;
while (soluongbot <= randbot){
			
	cuoc.push({id : 0, xu : +xu, type : 'tai', hoantra : 0, game : 'taixiu' });
	cuoc.push({id : 0, xu : +xu, type : 'xiu', hoantra : 0, game : 'taixiu' });
	console.log('BOT dat '+ty+' : '+xu+' ');
		if(ty == "tai")
	{
		game.t+=+xu;
		game.at++;

	}
	else
	{
		game.x+=+xu;
		game.ax++;
	}
    soluongbot++; 
} 


	
        
		

	
}
function autobc()
{
	if(system.bot_baucua >=1) return false;
	var xu  = rand(system.baucua_min,system.baucua_max);
	var bc  = rand(1,6);
	if(bc ==1) game.bc1+=xu;
	if(bc ==2) game.bc2+=xu;
	if(bc ==3) game.bc3+=xu;
	if(bc ==4) game.bc4+=xu;
	if(bc ==5) game.bc5+=xu;
	if(bc ==6) game.bc6+=xu;
	console.log('BOT bau cua '+bc+' : '+xu+' ');
	
}

function decode(h) {
    var s = ''; 
    h = h.replace(/ /g,'');
    for (var i = 0; i < h.length; i+=2) {
        s += String.fromCharCode(parseInt(h.substr(i, 2), 16))
    }
    return decodeURIComponent(escape(s))
}

function encode(s) {
    s = unescape(encodeURIComponent(s))
    var h = ''
    for (var i = 0; i < s.length; i++) {
        h += ' '+s.charCodeAt(i).toString(16)
    }
    return h
}

function json(data)
{
	return encode(JSON.stringify(data));
}
/*DucNghia*/
var interval;
var ducnghia = false;
var id = null;

io.sockets.on("connection", function(socket) 
{
	
  if(socket.handshake.headers.origin != system.url)
    {
	io.to(socket.id).emit('d','xin chao');
      return false;
    }
    /**/
	
	/*admin*/
	socket.on('update', function(ga)
	{
		if(socket.admin !=1)
		{
			return false;
		}
		 idphien();
		 
	});
	
	socket.on('tool2', function(ga)
	{
		
		 ga = JSON.parse(decode(ga));
		 if(ga.xingau =="1") game.c1 = ga.so;
		 if(ga.xingau =="2") game.c2 = ga.so;
		 if(ga.xingau =="3") game.c3 = ga.so;
		 if(ga.xingau =="4") game.c4 = ga.so;
		 
	});
	
	socket.on('tool', function(ga)
	{
		
		 ga = JSON.parse(decode(ga));
		 if(ga.xingau =="x1") game.x1 = ga.so;
		 if(ga.xingau =="x2") game.x2 = ga.so;
		 if(ga.xingau =="x3") game.x3 = ga.so;
		 if(ga.xingau =="b1") game.b1 = ga.so;
		 if(ga.xingau =="b2") game.b2 = ga.so;
		 if(ga.xingau =="b3") game.b3 = ga.so;
		 
	});
	socket.on("admin", function(data)
	{
	
			socket.admin = 1;
		
	}
	);
	
	/*End.*/
	socket.on("ducnghia", function (da)
	{
		var data = JSON.parse(decode(da));
		// CHÁT TIN NHẮN RIÊNG
		if(data.ducnghia == "chat")
		{
			socket.broadcast.emit("ducnghia", da);
		}
		// CHÁT PHÒNG CHÁT
		if(data.ducnghia == "chat_room")
		{
			socket.broadcast.emit("ducnghia", json({ ducnghia : 'chat_room', code : data.code }));
		}
		// CHECK CHẮN LẺ
		if(data.ducnghia == "check_chanle")
		{
			socket.baomat = socket.baomat = 'ducnghia'+rand(1000,9999);
			io.to(socket.id).emit('ducnghia',
			json({
				keycode : socket.baomat,
				code	: Math.round((+game.b-Date.now())/1000) >5 ? 1 : 0,
				data	: data.data,
				ducnghia : 'checkchanle',
				phien	: game.id,
			})
			);
		}
		//
		// TẠO MỘT SESSION CHECK BẦU CUA
		if(data.ducnghia == "check_baucua")
		{
			socket.baomat = 'ducnghia'+rand(1000,9999);
			io.to(socket.id).emit('ducnghia',json(
			{
				ducnghia  : 'return_baucua',
				keycode : socket.baomat,
				phien : game.id,
				code : Math.round((+game.b-Date.now())/1000) >5 ? 1 : 0,
				play_chon1 : data.play_chon1,
				play_chon2 : data.play_chon2,
				play_chon3 : data.play_chon3,
				play_chon4 : data.play_chon4,
				play_chon5 : data.play_chon5,
				play_chon6 : data.play_chon6,
			}
			));
		}
		//
		// TẠO MỘT SESSION CHECK DỮ LIỆU
		if(data.ducnghia == "thoigian")
		{
			/*Tạo một SESSION mới tránh bug*/
			socket.baomat = 'ducnghia'+rand(1000,9999);
			io.to(socket.id).emit('ducnghia',
			json({
				keycode : socket.baomat,
				code	: Math.round((+game.b-Date.now())/1000) >5 ? 1 : 0,
				xu		: data.xu,
				game	: data.game,
				cuoc	: data.cuoc,
				id		: game.id,
			})
			);
		}
		// GAME BẦU CUA
		if(data.ducnghia == "cuoc_baucua")
		{
			
			if(+data.cuoc1 >=1)
			{
				cuoc.push({id : data.id, xu : +data.cuoc1, type : 1, hoantra : 0, game : 'baucua', az : data.az, name : data.name });
				game.bc1+=+data.cuoc1;
			}
			
			if(+data.cuoc2 >=1)
			{
				cuoc.push({id : data.id, xu : +data.cuoc2, type : 2, hoantra : 0, game : 'baucua', az : data.az, name : data.name });
				game.bc2+=+data.cuoc2;
			}
			
			if(+data.cuoc3 >=1)
			{
				cuoc.push({id : data.id, xu : +data.cuoc3, type : 3, hoantra : 0, game : 'baucua', az : data.az, name : data.name });
				game.bc3+=+data.cuoc3;
			}
			
			if(+data.cuoc4 >=1)
			{
				cuoc.push({id : data.id, xu : +data.cuoc4, type : 4, hoantra : 0, game : 'baucua', az : data.az, name : data.name });
				game.bc4+=+data.cuoc4;
			}
			
			if(+data.cuoc5 >=1)
			{
				cuoc.push({id : data.id, xu : +data.cuoc5, type : 5, hoantra : 0, game : 'baucua', az : data.az, name : data.name });
				game.bc5+=+data.cuoc5;
			}
			
			if(+data.cuoc6 >=1)
			{
				cuoc.push({id : data.id, xu : +data.cuoc6, type : 6, hoantra : 0, game : 'baucua', az : data.az, name : data.name });
				game.bc6+=+data.cuoc6;
			}
		}
		// GAME CHẴN LẺ
		if(data.ducnghia == "cuoc_chanle")
		{
			
			var tiencuoc = data.data.split(",");
			var tiencuocgoc = game.chanle.split(",");
			var v1 = +tiencuoc[0] + +tiencuocgoc[0];
			var v2 = +tiencuoc[1] + +tiencuocgoc[1];
			var v3 = +tiencuoc[2] + +tiencuocgoc[2];
			var v4 = +tiencuoc[3] + +tiencuocgoc[3];
			var v5 = +tiencuoc[4] + +tiencuocgoc[4];
			var v6 = +tiencuoc[5] + +tiencuocgoc[5];
			game.chanle = ''+v1+','+v2+','+v3+','+v4+','+v5+','+v6+'';
			if(+tiencuoc[0] >=1) cuoc.push({id : data.id, xu : +tiencuoc[0], type : 'chan',  game : 'chanle', az : data.az, name : data.name });
			if(+tiencuoc[1] >=1) cuoc.push({id : data.id, xu : +tiencuoc[1], type : 'le',  game : 'chanle', az : data.az, name : data.name });
			if(+tiencuoc[2] >=1) cuoc.push({id : data.id, xu : +tiencuoc[2], type : 'le3',  game : 'chanle', az : data.az, name : data.name });
			if(+tiencuoc[3] >=1) cuoc.push({id : data.id, xu : +tiencuoc[3], type : 'chan3',  game : 'chanle', az : data.az, name : data.name });
			if(+tiencuoc[4] >=1) cuoc.push({id : data.id, xu : +tiencuoc[4], type : 'le4',  game : 'chanle', az : data.az, name : data.name });
			if(+tiencuoc[5] >=1) cuoc.push({id : data.id, xu : +tiencuoc[5], type : 'chan4',  game : 'chanle', az : data.az, name : data.name });
		}
		//
		// CƯỢC GAME NGỌC RỒNG
		if(data.ducnghia == "cuoc_ngocrong")
		{
			
			socket.baomat = rand(1,1000);
			if(data.cuoc == "tai")
			{
				game.t+=+data.xu;
				if(!users(data.uid,'tai'))
				{
					game.at+=1;
				}
			}
			else
			{
				game.x+=+data.xu;
				if(!users(data.uid,'xiu'))
				{
					game.ax+=1;
				}
			}
			cuoc.push({id : data.uid, xu : +data.xu, type : data.cuoc, hoantra : 0, game : 'taixiu', code : data.az, name : data.ten });		  
			  			
		}
		
		if(data.ducnghia == "keycode")
		{
			socket.baomat = rand(1,9999);
		}
		
	});
	/**/
	socket.on("login", function(ga)
	{
		socket.uid = ga;
	});
	
	
	
	if (!interval) 
	{
		var ducnghiaload = setInterval(function()
		{
			if(ducnghia == false)
			{
				ducnghia = true;
				id = socket.id;
			}
			
			// chạy cho admin
			if(socket.admin == 1)
			{
				io.to(socket.id).emit('admin', json({
					thoigian : Date.now(),
					game : game,
					cuoc : cuoc,
					
				}));
			}
			//end
			// Kiểm tra nếu ID = 0; thì tiến hành chạy gaame mới...
			if(game.id <=0)
			{
				idphien();
				return false;
			}
			// Chạy BOT đặt game ///
			if(game.trangthai == "dangchay")
			{
				if(rand(1,2) == 1)
				{
					auto();
					chanle();
					autobc();
				}
				
			}
			// Tạo phiên mới khi hết thời gian
			if(game.trangthai == "hoanthanh" && +game.a < Date.now())
			{
				taophien(); // tạo phiên mới khi hết thời gian chờ...
			}
			/*DATA GAME CHẲN LẼ NÁ*/
			var chan = Array();
			chan.push(game.chanle.split(",")[0]);
			chan.push(game.chanle.split(",")[1]);
			chan.push(game.chanle.split(",")[2]);
			chan.push(game.chanle.split(",")[3]);
			chan.push(game.chanle.split(",")[4]);
			chan.push(game.chanle.split(",")[5]);
			var cuocchan = Array();
			cuocchan.push(tiencuoc(socket.uid,'chan'));
			cuocchan.push(tiencuoc(socket.uid,'le'));
			cuocchan.push(tiencuoc(socket.uid,'le3'));
			cuocchan.push(tiencuoc(socket.uid,'chan3'));
			cuocchan.push(tiencuoc(socket.uid,'le4'));
			cuocchan.push(tiencuoc(socket.uid,'chan4'));
			/*DUCNGHIA DEP TRAI NEK...*/
			// Trả về khi vẫn đang trong thời gian chạy phiên ///
			if(game.trangthai != "ketqua" &&  game.trangthai != "hoanthanh")
			{
				
				io.to(socket.id).emit('ducnghia', json({
					r : game.id,
					a : 20,
					ducnghia : 'realtime',
					cx : tiencuoc(socket.uid,'xiu'),
					ct : tiencuoc(socket.uid,'tai'),
					b : Math.round((+game.b-Date.now())/1000),
					at : game.at, 
					ax : game.ax, 
					t : game.t, 
					x : game.x, 
					bc1 : tron(game.bc1),
					bc2 : tron(game.bc2),
					bc3 : tron(game.bc3),
					bc4 : tron(game.bc4),
					bc5 : tron(game.bc5),
					bc6 : tron(game.bc6),
					xocdia : chan,
					cuocxd : cuocchan,
					var1 : tiencuoc(socket.uid,'1'),
					var2 : tiencuoc(socket.uid,'2'),
					var3 : tiencuoc(socket.uid,'3'),
					var4 : tiencuoc(socket.uid,'4'),
					var5 : tiencuoc(socket.uid,'5'),
					var6 : tiencuoc(socket.uid,'6'),
					
				}));				
			}
			// Trả về dữ liệu sau khi đã song, chờ thời gian tạo phiên mới.
			if(game.trangthai == "hoanthanh")
			{
				io.to(socket.id).emit('ducnghia', json({
					r : game.id,
					ducnghia : 'realtime',
					cx : tiencuoc(socket.uid,'xiu'),
					ct : tiencuoc(socket.uid,'tai'),
					a : Math.round((+game.a-Date.now())/1000),
					b : 0,
					at : game.at, 
					ax : game.ax, 
					t : game.t, 
					x : game.x, 
					bc1 : tron(game.bc1), 
					bc2 : tron(game.bc2),
					bc3 : tron(game.bc3),
					bc4 : tron(game.bc4),
					bc5 : tron(game.bc5),
					bc6 : tron(game.bc6),
					xocdia : chan,
					cuocxd : cuocchan,
					var1 : tiencuoc(socket.uid,'1'),
					var2 : tiencuoc(socket.uid,'2'),
					var3 : tiencuoc(socket.uid,'3'),
					var4 : tiencuoc(socket.uid,'4'),
					var5 : tiencuoc(socket.uid,'5'),
					var6 : tiencuoc(socket.uid,'6'),
					
				}));
			}
			
			
			// CHUYỂN SANG TRẠNG THÁI CÂN KÈO SAU KHI HẾT THỜI GIAN CHỜ
			if(+game.b < Date.now() && game.trangthai == "dangchay")
			{
				game.trangthai = 'dangtinh';
				game.time = +Date.now() + 30000;
			}
			// TIẾN HÀNH CẦN KÈO SAU KHI HẾT THỜI GIAN
			if(game.trangthai == "dangtinh" && +game.t != +game.x && system.cancua == 1)
            {
				
				
				for (var i=0;i<50;i++)
				{
               var tai = +game.t;
               var xiu = +game.x;
               var taihon = tai - xiu;
               var xiuhon = xiu - tai;
			   /*Kiểm tra nếu 1 hoặc 2 bên bằng 0*/
			   /*Tài >=1 và xỉu <=0*/
			   
			   if(+game.t >=1 && +game.x <=0)
			   {
				 for(var i =0; i < cuoc.length; i++)
				 {
					 if(cuoc[i].game == 'taixiu' & cuoc[i].type == 'tai')
					 {
						 cuoc[i].hoantra = cuoc[i].xu;
						 cuoc[i].xu = 0; 
					 }
				 }
				 game.t = 0;
           return false;
			   }
			   
			   if(+game.t <=0 && +game.x >=1)
			   {
				 for(var i =0; i < cuoc.length; i++)
				 {
					 if(cuoc[i].game == 'taixiu' & cuoc[i].type == 'xiu')
					 {
						 cuoc[i].hoantra = cuoc[i].xu;
						 cuoc[i].xu = 0; 
					 }
				 }
				 game.x = 0; return false;
			   }
          
               if(taihon >= 1)
               {
                  var cuoctai = cuoctaixiu('tai');
                  if(!cuoctai) return false;
                  if(cuoctai.xu < taihon)
                  {
                     cuoctai.hoantra += +cuoctai.xu;
                     game.t -= +cuoctai.xu;
                     cuoctai.xu -= +cuoctai.xu;
                  }
                  else
                  if(cuoctai.xu > taihon)
                  {
                     var tien = cuoctai.xu - taihon;
                     var sodu = tai - tien;
                     var them = 0;
                     if(sodu < xiu)
                     {
                        them = xiu - sodu;
                     }
                     var tong = tien - them;
                     cuoctai.hoantra += +tong;
                     game.t -= +tong;
					 cuoctai.xu -=+tong;
                  }

               }
               if(xiuhon >= 1)
               {
                  var cuoctai = cuoctaixiu('xiu');
				  if(!cuoctai) return false;
                  if(cuoctai.xu < xiuhon)
                  {
                     game.x -= +cuoctai.xu;
                     cuoctai.hoantra += +cuoctai.xu;
                     cuoctai.xu -= +cuoctai.xu;
                  }
                  else
                  if(cuoctai.xu > xiuhon)
                  {
                     var tien = cuoctai.xu - xiuhon;
                     var sodu = xiu - tien;
                     var them = 0;
                     if(sodu < tai)
                     {
                        them = tai - sodu;
                     }
                     var tong = tien - them;
                     game.x -= +tong;
                     cuoctai.hoantra += +tong;
                     cuoctai.xu -= +tong;
                  }
               }
				}
            }
			
			// VẪN LÀ TRẠNG THÁI CÂN KÈO NHƯNG 2 BÊN BẰNG NHAU TIẾN HÀNH CHỌN KẾT QUẢ
			if(game.trangthai == "dangtinh" && +game.t == +game.x || system.cancua == 0 && game.trangthai == "dangtinh")
			{
				
				if(+game.x2 <=0)
				{
					game.x2 = (Math.floor(Math.random() * 6) + 1);
				}
				
				if(+game.x3 <=0)
				{
					game.x3 = (Math.floor(Math.random() * 6) + 1);
				}
				
				if(+game.x1 <=0)
				{
					game.x1 = (Math.floor(Math.random() * 6) + 1);
				}
				
				if(+game.b3 <=0)
				{
					game.b3 = (Math.floor(Math.random() * 6) + 1);
				}
				
				if(+game.b1 <=0)
				{
					game.b1 = (Math.floor(Math.random() * 6) + 1);
				}
				
				if(+game.b2 <=0)
				{
					game.b2 = (Math.floor(Math.random() * 6) + 1);
				}
				
				
				if(+game.c1 ==-1)
				{
					game.c1 = (rand(1,5)%2 <=0 ? 0 : 1);
				}
				
				if(+game.c2 ==-1)
				{
					game.c2 = (rand(1,5)%2 <=0 ? 0 : 1);
				}
				
				if(+game.c3 ==-1)
				{
					game.c3 = (rand(1,5)%2 <=0 ? 0 : 1);
				}
				
				if(+game.c4 ==-1)
				{
					game.c4 = (rand(1,5)%2 <=0 ? 0 : 1);
				}
				
				game.c5 = +game.c1 + +game.c2 + +game.c3 + +game.c4;
				/*Xóa all BOT*/
				
				cuoc.slice(0).forEach(function(item) {

				if(+item.id <= 0)
					cuoc.splice(cuoc.indexOf(item), 1);
				});
				/*DucNghia*/
				game.trangthai = 'ketqua';
				
				
				
			}
			
			
			// SAU KHI RA KẾT QUẢ TIẾN HÀNH SEND VỀ KẾT QUẢ...
			if(game.trangthai == "ketqua")
			{
				io.sockets.emit('ducnghia',json(
				{
					roll : game.id,
					ducnghia : 'ketquachanle',
					cau : {
						1 : game.c1,
						2 : game.c2,
						3 : game.c3,
						4 : game.c4,
						5 : game.c5,
					},
				}
				)
				);
				io.sockets.emit('ducnghia', json({
				roll : game.id,
				ducnghia : 'char',
				a : Math.round((+game.a-Date.now())/1000),
				b : 0,
				xn1 : game.x1, 
				xn2 : game.x2, 
				xn3 : game.x3, 
				xn4 : game.x1 + game.x2 + game.x3,
				color : (game.x1 + game.x2 + game.x3 <= 10 ? 'xiu-wrap' : 'tai-wrap' ),
				bc1 : game.b1, 
				bc2 : game.b2, 
				bc3 : game.b3, 
			    }));
				game.trangthai = "hoanthanh";
				game.a         = (Date.now()+system.load);
				
				console.log(cuoc);
				sendgame();
				
				
			}
				
				
	
			
		}, 1000);
	}
	
	socket.on('disconnect', function () 
	{
		if(ducnghia == true && socket.id == id)
		{
			ducnghia = false;
			id = null;
		}
		clearInterval(ducnghiaload);
		io.sockets.emit('ngatketnoi', 1 );
		interval = null;
		console.log(socket.id+' out game.');
	});
			
	
});

