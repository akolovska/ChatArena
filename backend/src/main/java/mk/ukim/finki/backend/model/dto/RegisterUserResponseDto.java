package mk.ukim.finki.backend.model.dto;

import mk.ukim.finki.backend.model.domain.User;
import mk.ukim.finki.backend.model.enums.Role;

public record RegisterUserResponseDto(
        Long id,
        String username,
        String name,
        String surname,
        String email,
        Role role
) {
    public static RegisterUserResponseDto from(User user) {
        return new RegisterUserResponseDto(
                user.getId(),
                user.getUsername(),
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getRole()
        );
    }
}

