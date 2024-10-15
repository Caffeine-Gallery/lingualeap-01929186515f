import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor {
  // Define a type for storing translations
  type Translation = {
    original: Text;
    translated: Text;
    targetLanguage: Text;
  };

  // Store translations in a stable variable
  stable var translations : [Translation] = [];

  // Add a new translation to the history
  public func addTranslation(original: Text, translated: Text, targetLanguage: Text) : async () {
    let newTranslation : Translation = {
      original = original;
      translated = translated;
      targetLanguage = targetLanguage;
    };
    translations := Array.append(translations, [newTranslation]);
  };

  // Get all translations
  public query func getTranslations() : async [Translation] {
    return translations;
  };

  // Clear all translations
  public func clearTranslations() : async () {
    translations := [];
  };
}
