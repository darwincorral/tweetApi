import { Controller, Get, Param } from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';
import { FB } from 'fb';
import * as fs from 'fs';

@Controller('socialNetworks')
export class AppController {
  constructor() {}
  textPost = `😎 Publicado desde NEST JS!!!! 💀`;

  @Get('twitterPost')
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

      // Publicar el tweet
      const tweet = await client.v2.tweetThread([
        { text: this.textPost, media: { media_ids: [mediaId] } },
      ]);

      // Devolver el tweet como respuesta
      return { tweet };
    } catch (error) {
      // Manejar errores
      console.error('Error al publicar el tweet:', error);
      throw error;
    }
  }

  @Get('facebookPost')
  async getPostFacebook(): Promise<string> {
    try {
      // Establecer el token de acceso
      FB.setAccessToken('YOUR_TOKEN'); 

      // Crear una promesa para envolver la llamada a FB.api()
      const postPromise = new Promise<string>((resolve, reject) => {
        FB.api('me/photos', 'post', { source: fs.createReadStream('test.jpg'), caption: this.textPost }, (res) => {
          if (!res || res.error) {
            console.error(!res ? 'Error occurred' : res.error);
            reject(!res ? 'Error occurred' : res.error);
          } else {
            console.log('Post Id: ' + res.post_id);
            resolve(res.post_id);
          }
        });
      });

      // Esperar a que se resuelva la promesa y devolver el resultado
      return await postPromise;
    } catch (error) {
      // Manejar errores
      console.error('Error al publicar el post:', error);
      throw error;
    }
  }
}
