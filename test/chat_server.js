/**
 * Created by gospray on 16-12-25.
 */
//var io = require('socket.io').listen(80)
var app = require('http').createServer(handler)
    , io = require('socket.io').listen(app)

app.listen(80);

function handler(req, res) {
    if (req.url == "/monitor") {
        res.writeHead(200);
        res.end("OK");
    }
    else {
        res.writeHead(404);
        res.end();
    }
}


//io.disable('heartbeats')
//io.set('heartbeats', false);
io.set('transports', ['websocket', 'xhr-polling']);
io.set('heartbeat timeout', 5 * 60)
io.set('heartbeat interval', 4 * 60)
io.set('close timeout', 1 * 30);
io.set("log level", 1)
io.set("browser client", false)
io.set("browser client cache", false)
io.set("browser client cache", false)
var redis = require("redis")
var pub = redis.createClient()
var store = redis.createClient()
var snschat = redis.createClient()
var notification = redis.createClient()
var PUSH_TO_IOS_DELAY_TIME = 120000
snschat.subscribe("snschat");
notification.subscribe("notification")
var sockets = {}

pub.on("error", function (err) {
    console.log("Error " + err);
});

store.on("error", function (err) {
    console.log("Error " + err);
});

snschat.on("error", function (err) {
    console.log("Error " + err);
});


function send_msg_delay(socket) {
    store.hget("chat_history", socket.userid, function (e, v) {
        if (v) {
            list = JSON.parse(v);
            if (list.length > 0) {
                var msg = JSON.stringify(list)
                socket.isSendingChatMessage = false
                send_msg(socket, msg)
            }
        }
    })
}

function send_msg(socket, msg) {
    //delay for 5 sec
    if (socket.isSendingChatMessage) {
        setTimeout(function () {
            send_msg_delay(socket)
        }, 5000)
        return
    }
    socket.isSendingChatMessage = true

    //start send
    var callSendToIOS = sendToIOSDealy(socket.userid, PUSH_TO_IOS_DELAY_TIME)

    //当chat事件有反馈确认时，调用ack，并删除
    socket.emit("chat", msg, function ack(size) {
        clearTimeout(callSendToIOS)

        store.hget("chat_history", socket.userid, function (e, v) {
            if (v) {
                list = JSON.parse(v);
                //对方收到消息后，删除所有历史消息
                if (list.length == size) {
                    store.hdel("chat_history", socket.userid, function (e, r) {
                    })
                }
                //如果历史消息中包含新保存的消息，则保留新消息，只删除已发送的历史消息
                else if (size < list.length) {
                    list = list.splice(size)
                    var msglist = JSON.stringify(list)
                    store.hset("chat_history", socket.userid, msglist, function (e, r) {
                    })
                }
            }
            socket.isSendingChatMessage = false

        })
    })
}


function sendToIOSDealy(toWho, time) {
    return setTimeout(function () {
        sendToIOS(toWho)
    }, time)
}

function sendToIOS(toWho) {
    var obj = {"toWho": toWho}
    var msg = JSON.stringify(obj)
    console.log("delay send to ios channel:" + msg)
    pub.publish("chat_message_channel", msg)
}

function send_notification(socket, notif) {
    socket.emit("notification", notif, function ack() {
        store.hdel("nodejs_notification", socket.userid)
    })
}

function send_store_msg(socket, userid) {

    if (socket.isSendStoreMsg) {
        return;
    }

    socket.isSendingChatMessage = false

    //如果有之前未发送的消息，现在发送，发送完，然后删除redis中存储的消息
    store.hget("chat_history", userid, function (e, msg) {
        if (msg) {
            send_msg(socket, msg)
            //store.hdel("chat_history", socket.userid, function (e, r) {
            //})
        }
    })

    //如果有之前未发送的通知，现在发送，发送完，然后删除redis中存储的通知
    store.hget("nodejs_notification", userid, function (e, msg) {
        if (msg) {
            var msglist = JSON.parse(msg)
            for (var i = 0; i < msglist.length; i++) {
                send_notification(socket, msglist[i])
            }
            //socket.emit("notification", msg)
            //store.hdel("nodejs_notification", userid)
        }
    })
    socket.isSendStoreMsg = true
}

function saveToChatHistory(msg) {
    var list = []
    store.hget("chat_history", msg.to, function (e, v) {
        if (v) {
            list = JSON.parse(v);
        }
        list.push(msg)
        var msglist = JSON.stringify(list)
        store.hset("chat_history", msg.to, msglist, function (e, r) {
        })
    })
}


function pushToChatHistoryChannel(msg) {
    var msgStr = JSON.stringify(msg)
    pub.publish("chat_message_history_channel", msgStr)
    // chat_history
}

function process_msg(msg) {
    var list = []
    store.hget("chat_history", msg.to, function (e, v) {
        if (v) {
            list = JSON.parse(v);
        }
        list.push(msg)
        var msglist = JSON.stringify(list)
        // unread_msg
        store.hset("chat_history", msg.to, msglist, function (e, r) {
        });
        if (sockets[msg.to]) {
            send_msg(sockets[msg.to], msglist)
        }
        else {
            sendToIOS(msg.to)
        }
        pushToChatHistoryChannel(msg)
    })
}

// check redis notifcation channel
notification.on("message", function (pattern, msg) {
    var msgobj = JSON.parse(msg)
    var keys = msgobj.toWho
    var needStore = msgobj.needStore
    for (index in keys) {
        var key = keys[index]
        if (!needStore) {
            if (sockets[key]) {
                sockets[key].emit("notification", msg)
            }
        }
        else {
            // 先保存消息，然后再发送，然后发送成功后再删除
            // 异步流程控制有问题 发送通知因该在保存消息 之后
            var list = []
            store.hget("nodejs_notification", key, function (e, v) {
                if (v) {
                    list = JSON.parse(v);
                }
                list.push(msg)
                var msglist = JSON.stringify(list)
                store.hset("nodejs_notification", key, msglist, function (e, r) {
                })
            })

            // 如果 对应的socket不存在，则不发送，则消息保存在nodejs_notification表中
            if (sockets[key]) {
                send_notification(sockets[key], msg)
            }

        }
    }
})

// check redis snschat channel
snschat.on("message", function (pattern, data) {
    msg = JSON.parse(data)
    process_msg(msg)
})


io.sockets.on('connection', function (socket) {
    var address = socket.handshake.address;
    console.log(Date() + " New connection from " + address.address + ":" + address.port);
    socket.on('login', function (userinfo) {
        userid = userinfo.myAuraId
        var address = socket.handshake.address;
        var deviceid = userinfo.deviceId
        console.log(Date() + " Login from " + address.address + ":" + address.port + " " + userid + " " + deviceid);
        old_socket = sockets[userid]
        // 防止不同设备同时登录，有新设备登录时，旧设备中的socket自动退出登录,并断开连接
        //可以简化：如果新旧socket不等，则旧socket退出登录，断开连接
        if (old_socket && old_socket.deviceid && deviceid && old_socket.deviceid != deviceid) {
            old_socket.relogin = 1
            old_socket.emit('logout')
            console.log("logout " + old_socket.userid + " " + old_socket.deviceid)
            old_socket.disconnect()
        }

        //在新socket中记录用户编号和设备编号
        socket.relogin = 0
        socket.userid = userid
        socket.deviceid = deviceid

        //发送之前保存的消息和通知，在发送完后，删除消息和通知
        send_store_msg(socket, userid)

        //将新的socket存储在全局变量中
        sockets[userid] = socket
        //向login_message_channel信道发布用户信息
        pub.publish("login_message_channel", JSON.stringify(userinfo))

    });

    socket.on('geo', function (geo, ack) {
        if (sockets[geo.myAuraId]) {

            var now = new Date()
            pub.publish("geo", JSON.stringify({
                geo: geo, time: now.getTime()
            }))
            /*
            socket.userid = geo.myAuraId
            sockets[socket.userid] = socket

            if (ack) {
                ack(1)
                send_store_msg(socket, userid)

            }
            */
        }
    })

    socket.on('chat', function (msg, ack) {
        //process_msg(msg)
        //chat_filter_channel snschat
        pub.publish("chat_filter_channel", JSON.stringify(msg))
        //socket.userid = msg.from
        //sockets[socket.userid] = socket
        if (ack) {
            ack(1)
        }

    })

    socket.on('hb', function (msg, ack) {
        //通过回调函数反馈心跳事件
        if (ack) {
            ack(1)
        }
    })


    socket.on("disconnect", function () {
        var address = socket.handshake.address;
        console.log(Date() + " Disconnect from " + address.address + ":" + address.port);

        if (!socket.relogin) {
            delete sockets[socket.userid]
        }
    })

})