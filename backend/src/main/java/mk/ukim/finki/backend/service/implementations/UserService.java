package mk.ukim.finki.backend.service.implementations;

import mk.ukim.finki.backend.model.domain.User;
import mk.ukim.finki.backend.model.dto.LoginUserRequestDto;
import mk.ukim.finki.backend.model.dto.LoginUserResponseDto;
import mk.ukim.finki.backend.model.dto.RegisterUserRequestDto;
import mk.ukim.finki.backend.model.dto.RegisterUserResponseDto;
import mk.ukim.finki.backend.model.exceptions.IncorrectPasswordException;
import mk.ukim.finki.backend.model.exceptions.UserNotFoundException;
import mk.ukim.finki.backend.model.exceptions.UsernameAlreadyExistsException;
import mk.ukim.finki.backend.repository.UserRepository;
import mk.ukim.finki.backend.service.IUserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<RegisterUserResponseDto> findByUsername(String username) {
        return userRepository.findByUsername(username).map(RegisterUserResponseDto::from);
    }

    @Override
    public Optional<RegisterUserResponseDto> register(RegisterUserRequestDto registerUserRequestDto) {
        if (userRepository.existsByUsername(registerUserRequestDto.toUser().getUsername()))
            throw new UsernameAlreadyExistsException(registerUserRequestDto.toUser().getUsername());
        return RegisterUserResponseDto.from(userRepository.save(new User(
                registerUserRequestDto.toUser().getName(),
                registerUserRequestDto.toUser().getSurname(),
                registerUserRequestDto.toUser().getEmail(),
                registerUserRequestDto.toUser().getUsername(),
                passwordEncoder.encode(registerUserRequestDto.toUser().getPassword())
        )));
    }

    @Override
    public Optional<LoginUserResponseDto> login(LoginUserRequestDto loginUserRequestDto) {
        String username = loginUserRequestDto.username();
        String password = loginUserRequestDto.password();
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        if (!passwordEncoder.matches(password, user.getPassword()))
            throw new IncorrectPasswordException();
        return user;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

}
