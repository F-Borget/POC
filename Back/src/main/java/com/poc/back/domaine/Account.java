package com.poc.back.domaine;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "comptes")
public class Account implements UserDetails {
    // Getters et Setters
    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    @Column(nullable = false, unique = true)
    private String username;

    // Ajoute du hashage si nécessaire
    @Setter
    @Getter
    @Column(nullable = false)
    private String password;

    @Setter
    @Getter
    @Column(nullable = false)
    private String firstname;

    @Setter
    @Getter
    @Column(nullable = false)
    private String lastname;

    @Setter
    @Getter
    @Column(nullable = false)
    private String role;

    @Setter
    @Getter
    private int managerId;


    /*@ManyToMany
    @JoinTable(
            name = "account_projet",
            joinColumns = @JoinColumn(name = "account_id"),
            inverseJoinColumns = @JoinColumn(name = "projet_id")
    )
    private List<Projet> projet;*/

    public boolean checkPassword(String rawPassword) {
        return this.password.equals(rawPassword);
    }

    // Implémentation des méthodes de UserDetails

    @JsonIgnore
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = this.role.toUpperCase().startsWith("ROLE_") ? this.role.toUpperCase() : "ROLE_" + this.role.toUpperCase();
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    @JsonProperty("authorities") // Sérialise le rôle sous forme de liste de chaînes
    public List<String> getRolesAsStrings() {
        return getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
