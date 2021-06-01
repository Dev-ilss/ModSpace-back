import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * @author Raul E. Aguirre H.
   * @ysp0lur
   */

  getHello(): string {
    return `Welcome to Dev-ilss Group! Visit www.devilss.com`;
  }
}
