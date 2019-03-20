let mqtt = require('mqtt');
let MqttClient = mqtt.connect("ws://mqtt-broker.i2g.cloud:8888");
MqttClient.on('connect', () => {
	console.log("Connected to broker ws://mqtt-broker.i2g.cloud:8888");
});
MqttClient.on('error', () => {
	console.log("Mqtt connect failed");
});

module.exports = MqttClient;