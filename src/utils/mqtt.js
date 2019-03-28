let mqtt = require('mqtt');
let MqttClient = mqtt.connect(process.env.STORAGE_MQTT_BROKER || "ws://mqtt-broker.i2g.cloud:8888");
MqttClient.on('connect', () => {
	console.log("Connected to broker " + (process.env.STORAGE_MQTT_BROKER || "ws://mqtt-broker.i2g.cloud:8888"));
});
MqttClient.on('error', () => {
	console.log("Mqtt connect failed");
});

module.exports = MqttClient;