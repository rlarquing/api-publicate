import {
  Body,
  Controller,
  Post,
  ValidationPipe,
  UseGuards,
  Get,
  Query,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser, Roles } from '../decorator';
import { AuthService } from '../../core/service';
import {
  ActivateUserDto,
  AuthCredentialsDto,
  ChangePasswordDto,
  RefreshTokenDto,
  RequestResetPasswordDto,
  ResetPasswordDto,
  ResponseDto,
  SecretDataDto,
  UserDto,
} from '../../shared/dto';
import { UserEntity } from '../../persistence/entity';
import { RolType } from '../../shared/enum';
import { PermissionGuard, RolGuard } from '../guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Registrar usuario' })
  @ApiResponse({
    status: 201,
    description: 'Registro de los usuarios',
  })
  @ApiBody({
    description: 'Estructura para crear el usuario.',
    type: UserDto,
  })
  async signUp(@Body(ValidationPipe) userDto: UserDto): Promise<ResponseDto> {
    return await this.authService.signUp(userDto);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Logeo de usuarios' })
  @ApiResponse({
    status: 201,
    description: 'Login de los usuarios',
    type: SecretDataDto,
  })
  @ApiBody({
    description: 'Estructura para el logeo del usuario.',
    type: AuthCredentialsDto,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Mensaje de usuario o contraseña incorrecto',
  })
  async signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<SecretDataDto> {
    return await this.authService.signIn(authCredentialsDto);
  }

  @Post('/refresh/tokens')
  @ApiOperation({ summary: 'Obtener el token nuevo para los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Token nuevo para de los usuarios',
    type: SecretDataDto,
  })
  @ApiBody({
    description: 'Estructura para el envio del refresh token.',
    type: RefreshTokenDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @UseGuards(AuthGuard('refresh'))
  @ApiBearerAuth()
  async regenerateTokens(@GetUser() user: UserEntity): Promise<SecretDataDto> {
    return await this.authService.regenerateTokens(user);
  }

  @Post('/logout')
  @ApiOperation({ summary: 'Desloguear un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Deslogear un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @UseGuards(AuthGuard('jwt'))
  async logout(@GetUser() user: UserEntity): Promise<ResponseDto> {
    return await this.authService.logout(user);
  }

  @Get('/activate/account')
  @ApiOperation({ summary: 'Activar cuenta de usuario' })
  @ApiResponse({
    status: 200,
    description: 'Activar la cuenta de un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  activateAccount(
    @Query() activateUserDto: ActivateUserDto,
  ): Promise<ResponseDto> {
    return this.authService.activateUser(activateUserDto);
  }

  @Patch('/request/reset/password')
  @ApiOperation({
    summary:
      'Enviar correo de recuperación de contraseña de la cuenta de usuario',
  })
  @ApiBody({
    description: 'Estructura para enviar el correo de recuperación.',
    type: RequestResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description:
      'Envia un correo de recuperación de la contraseña de la cuenta de un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  requestResetPassword(
    @Body() requestResetPasswordDto: RequestResetPasswordDto,
  ): Promise<ResponseDto> {
    return this.authService.requestResetPasword(requestResetPasswordDto);
  }

  @Patch('/reset/password')
  @ApiOperation({ summary: 'Recuperar contraseña de la cuenta de usuario' })
  @ApiBody({
    description: 'Estructura para recuperar la contra.',
    type: ResetPasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Recupera la contraseña de la cuenta de un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseDto> {
    return this.authService.resetPasword(resetPasswordDto);
  }

  @Patch('/change/password')
  @Roles(RolType.USUARIO)
  @UseGuards(AuthGuard('jwt'), RolGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar password a un usuario' })
  @ApiBody({
    description: 'Estructura para cambiar el password del usuario.',
    type: ChangePasswordDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Cambia el password de un usuario',
    type: ResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Sin autorizacion.' })
  @ApiResponse({ status: 403, description: 'Sin autorizacion al recurso.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async changePassword(
    @GetUser() user: UserEntity,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseDto> {
    return await this.authService.changePassword(user, changePasswordDto);
  }
}
