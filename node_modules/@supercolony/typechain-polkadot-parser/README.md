# Typechain-polkadot-parser

---

Utility package for parsing ABIs of Polkadot smart contracts.

## Types

---

- `class TypeParser` - Parser for ABIs of Polkadot smart contracts. It contains only one public method `getType` that takes type id as a parameter and returns a `TypeInfo` object. Also it has public field `tsTypes` that contains a map of all parsed types.

- `class TypeInfo` - Contains information about a type.
``` typescript
	id: number; // - type id
	tsArgType: string; // - TypeScript type for function arguments
	tsReturnType: string; // - TypeScript type for function return value
	tsArgTypePrefixed: string; // - TypeScript type for function arguments with prefix (for imports)
	tsReturnTypePrefixed: string; // - TypeScript type for function return value with prefix (for imports)
	typeDescription: TypeTS; // - type description in TypeScript
	// For enums and composites
	bodyArgType ?: string; // - TypeScript type for function arguments
	bodyReturnType ?: string; // - TypeScript type for function return value
```
