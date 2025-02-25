// src/app.js
import { KafkaResponseConsumer } from './kafkaResponseConsumer.js';
import { Server } from './server.js';
import { RequestResponseService } from './requestResponseService.js';
import { KafkaToRabbitMQConsumer } from './kafkaToRabbitMQConsumer.js'; // Import KafkaToRabbitMQConsumer
import { config } from './config.js';

class App {
    private static instance: App;
    private server: Server;
    private kafkaResponseConsumer: KafkaResponseConsumer;
    private kafkaToRabbitMQConsumer: KafkaToRabbitMQConsumer; // Add KafkaToRabbitMQConsumer
    public requestResponseService: RequestResponseService;

    private constructor() {
        this.server = new Server();
        this.requestResponseService = new RequestResponseService();
        this.kafkaResponseConsumer = this.initializeKafkaConsumer();
        this.kafkaToRabbitMQConsumer = new KafkaToRabbitMQConsumer(); // Initialize KafkaToRabbitMQConsumer
    }

    /**
     * Gets the singleton instance of the App.
     * @returns App instance
     */
    public static getInstance(): App {
        if (!App.instance) {
            App.instance = new App();
        }
        return App.instance;
    }

    /**
     * Initializes the Kafka response consumer.
     * @returns KafkaResponseConsumer instance
     */
    private initializeKafkaConsumer(): KafkaResponseConsumer {
        return new KafkaResponseConsumer(
            config.kafka.topics.response,
            config.kafka.groupId,
            this.requestResponseService
        );
    }

    /**
     * Starts the application components.
     */
    public start(): void {
        this.server.start();
        this.kafkaResponseConsumer.start();
        this.kafkaToRabbitMQConsumer.start();
        
        console.log(`🚀 Server is running on port ${config.server.port}`);
    }
}

export { App };
