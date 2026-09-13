package mk.ukim.finki.backend.service.implementations;

import jakarta.transaction.Transactional;
import mk.ukim.finki.backend.helpers.JwtHelper;
import mk.ukim.finki.backend.model.domain.User;
import mk.ukim.finki.backend.model.dto.LoginUserRequestDto;
import mk.ukim.finki.backend.model.dto.LoginUserResponseDto;
import mk.ukim.finki.backend.model.dto.RegisterUserRequestDto;
import mk.ukim.finki.backend.model.dto.RegisterUserResponseDto;
import mk.ukim.finki.backend.model.enums.Role;
import mk.ukim.finki.backend.model.exceptions.IncorrectPasswordException;
import mk.ukim.finki.backend.model.exceptions.UserNotFoundException;
import mk.ukim.finki.backend.model.exceptions.UsernameAlreadyExistsException;
import mk.ukim.finki.backend.repository.UserRepository;
import mk.ukim.finki.backend.service.IUserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtHelper jwtHelper;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtHelper jwtHelper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtHelper = jwtHelper;
    }

    @Override
    public Optional<RegisterUserResponseDto> register(RegisterUserRequestDto registerUserRequestDto) {
        if (userRepository.existsByUsername(registerUserRequestDto.username()))
            throw new UsernameAlreadyExistsException(registerUserRequestDto.username());
        User user = userRepository.save(new User(
                registerUserRequestDto.name(),
                registerUserRequestDto.surname(),
                registerUserRequestDto.email(),
                registerUserRequestDto.username(),
                passwordEncoder.encode(registerUserRequestDto.password())
        ));
        RegisterUserResponseDto displayUserDto = RegisterUserResponseDto.from(user);
        return Optional.of(displayUserDto);
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

        String token = jwtHelper.generateToken(user);

        return Optional.of(new LoginUserResponseDto(token, user.getRole()));
    }

    @Override
    public List<RegisterUserResponseDto> findAll() {
        return userRepository.findAll().stream().map(RegisterUserResponseDto::from).toList();
    }

    @Override
    @Transactional
    public RegisterUserResponseDto updateUserRole(Long id, Role role) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(""));
        user.setRole(role);
        return RegisterUserResponseDto.from(userRepository.save(user));
    }

    @Override
    public Optional<RegisterUserResponseDto> findByUsername(String username) {
        return userRepository
                .findByUsername(username)
                .map(RegisterUserResponseDto::from);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(username));
    }

}
