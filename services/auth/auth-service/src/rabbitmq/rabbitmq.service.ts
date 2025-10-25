import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private client: amqp.Connection;
  private channel: amqp.Channel;

  async onModuleInit() {
    try {
      this.client = await amqp.connect(process.env.RABBITMQ_URI || 'amqp://localhost');
      this.channel = await this.client.createChannel();
      await this.channel.assertQueue('user_registered_queue', { durable: true });
      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ', error);
    }
  }

  async onModuleDestroy() {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.client) {
      await this.client.close();
    }
    console.log('Disconnected from RabbitMQ');
  }

  async publish(queue: string, message: any) {
    if (!this.channel) {
      console.error('RabbitMQ channel not available.');
      return;
    }
    try {
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
      console.log(`Message published to queue ${queue}: ${JSON.stringify(message)}`);
    } catch (error) {
      console.error(`Failed to publish message to queue ${queue}:`, error);
    }
  }

  async checkHealth(): Promise<any> {
    if (this.client && this.client.connection.heartbeat) {
      return { status: 'message queue is up' };
    }
    throw new Error('RabbitMQ connection is down');
  }
}
