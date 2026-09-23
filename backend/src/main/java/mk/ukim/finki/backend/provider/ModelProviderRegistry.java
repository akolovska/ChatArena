package mk.ukim.finki.backend.provider;

import mk.ukim.finki.backend.model.exceptions.ModelProviderException;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class ModelProviderRegistry {

    private final Map<String, ModelProvider> providersByType;

    public ModelProviderRegistry(StaticJsonModelProvider staticProvider,
                                 ObjectProvider<OpenRouterModelProvider> openRouterProvider) {
        this.providersByType = new HashMap<>();
        providersByType.put("static-json", staticProvider);

        OpenRouterModelProvider openRouter = openRouterProvider.getIfAvailable();
        if (openRouter != null) {
            providersByType.put("openrouter", openRouter);
        }
    }

    public ModelProvider get(String providerType) {
        ModelProvider provider = providersByType.get(providerType);
        if (provider == null) {
            throw new ModelProviderException("No provider registered for type: " + providerType);
        }
        return provider;
    }
}