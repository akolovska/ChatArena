package mk.ukim.finki.backend.web.controller;

import mk.ukim.finki.backend.model.domain.User;
import mk.ukim.finki.backend.model.dto.LoginUserRequestDto;
import mk.ukim.finki.backend.model.dto.LoginUserResponseDto;
import mk.ukim.finki.backend.model.dto.RegisterUserRequestDto;
import mk.ukim.finki.backend.model.dto.RegisterUserResponseDto;
import mk.ukim.finki.backend.model.enums.Role;
import mk.ukim.finki.backend.service.IUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {
    private final IUserService userApplicationService;

    public UserController(IUserService userApplicationService) {
        this.userApplicationService = userApplicationService;
    }

    @GetMapping()
    public ResponseEntity<List<RegisterUserResponseDto>> findAll() {
        return ResponseEntity.ok(userApplicationService
                .findAll());
    }

    @GetMapping("/{username}")
    public ResponseEntity<RegisterUserResponseDto> findByUsername(@PathVariable String username) {
        return userApplicationService
                .findByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/me")
    public ResponseEntity<RegisterUserResponseDto> me(@AuthenticationPrincipal User user) {
        return userApplicationService
                .findByUsername(user.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterUserResponseDto> register(@RequestBody RegisterUserRequestDto registerUserRequestDto) {
        return userApplicationService
                .register(registerUserRequestDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }

    @PostMapping("/login")
    public ResponseEntity<LoginUserResponseDto> login(@RequestBody LoginUserRequestDto loginUserRequestDto) {
        return userApplicationService
                .login(loginUserRequestDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest().build());
    }
    @PutMapping("/{id}/role")
    public RegisterUserResponseDto updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Role role = Role.valueOf(body.get("role"));
        return userApplicationService.updateUserRole(id, role);
    }
}
