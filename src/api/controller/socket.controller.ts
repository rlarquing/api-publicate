import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocketService } from '../../core/service';
import { Storage } from 'megajs';
import { File } from 'megajs';
import * as fs from 'fs';

@ApiTags('Socket')
@Controller('socket')
export class SocketController {
  constructor(private readonly socketService: SocketService) {}

  @Get()
  async getHello(): Promise<string> {
    // Crear una instancia de Mega con tus credenciales
    const storage = await new Storage({
      email: 'publicate3@gmail.com',
      password: 'Publ!c@te3',
    }).ready;
    //subir ficheros
    // const file = await storage.upload('hello-world.txt', 'Hello world!')
    //   .complete;
    // console.log('The file was uploaded!', file);

    // const file = File.fromURL(
    //   'https://mega.nz/file/wPQEDCAQ#y-4tlld0e0Cvy_hBoqDBvMo0QixfJ-_fvG9IDh1DTww',
    // );

    // await file.loadAttributes();
    // console.log(file.name); // file name
    // console.log(file.size); // file size in bytes
    //
    // const data = await file.downloadBuffer({ forceHttps: true });
    // console.log(data.toString()); // file contents

    // Using promises
    // const link = await file.link({ noKey: true });

    //It will log something like https://mega.nz/file/example#example
    // console.log(link);

    const file = storage.root.children.find(
      (file) => file.name === 'hello-world.txt',
    );
    // Using promises
    const link = await file.link({ noKey: false });

    //It will log something like https://mega.nz/file/example#example
    console.log(link);
    const stream = file.download({ forceHttps: true });
    stream.on('error', (error) => console.error(error));
    stream.pipe(fs.createWriteStream(file.name));
    return this.socketService.getHello();
  }
  // @Get('/:id')
  // async gpsTren(@Param('id') id: string): Promise<any> {
  //   return await this.socketService.gpsTren(id);
  // }
}
