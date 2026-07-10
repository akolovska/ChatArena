package mk.ukim.finki.backend.model.enums;

import org.springframework.security.core.GrantedAuthority;

public enum Role implements GrantedAuthority {
    ROLE_USER,
    ROLE_EVALUATOR,
    ROLE_ADMIN;

    @Override
    public String getAuthority() {
        return name();
    }
}
