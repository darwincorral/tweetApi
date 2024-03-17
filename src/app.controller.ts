import { Controller, Get} from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';

@Controller('tweets')
export class AppController {

  constructor() { }

  @Get()
  async getPostTweet() {
    try {
      // Crear el cliente de Twitter
      const client = new TwitterApi({
        appKey: 'YOUR_APP_KEY',
        appSecret: 'YOUR_APP_SECRET',
        accessToken: 'YOUR_ACCES_TOKEN',
        accessSecret: 'YOUR_ACCES_SECRET',
      });

      
      // Subir la imagen
      const mediaId = await client.v1.uploadMedia('./test.jpg');

      // Texto del tweet
      const tweetText = `Estoy en twitter fu**ck 😎\nPublicado desde NEST JS!!!! 💀`;

      // Publicar el tweet
      const tweet = await client.v2.tweetThread([
        { text: tweetText, media: { media_ids: [mediaId] } },
      ]);

      // Devolver el tweet como respuesta
      return { tweet };
    } catch (error) {
      // Manejar errores
      console.error('Error al publicar el tweet:', error);
      throw error;
    }
  }
}