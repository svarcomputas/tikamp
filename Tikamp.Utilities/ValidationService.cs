using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Tikamp.Utilities;

public class ValidationService(IServiceProvider serviceProvider, ILogger<ValidationService> logger)
{
    public async Task Validate<TModel>(TModel instance, CancellationToken cancellationToken)
    {
        var validator = serviceProvider.GetService<IValidator<TModel>>();
        if (validator == null)
        {
            logger.LogWarning("Did not find any IValidator for {ModelName}", typeof(TModel).Name);
            return;
        }

        await validator.ValidateAndThrowAsync(instance, cancellationToken);
    }
}