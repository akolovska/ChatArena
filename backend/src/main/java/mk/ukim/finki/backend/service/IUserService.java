package mk.ukim.finki.backend.service;

import mk.ukim.finki.backend.model.domain.User;
import mk.ukim.finki.backend.model.dto.LoginUserRequestDto;
import mk.ukim.finki.backend.model.dto.LoginUserResponseDto;
import mk.ukim.finki.backend.model.dto.RegisterUserRequestDto;
import mk.ukim.finki.backend.model.dto.RegisterUserResponseDto;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.Optional;

public interface IUserService extends UserDetailsService {
    Optional<RegisterUserResponseDto> findByUsername(String username);

    Optional<RegisterUserResponseDto> register(RegisterUserRequestDto registerUserRequestDto);

    Optional<LoginUserResponseDto> login(LoginUserRequestDto loginUserRequestDto);
}
