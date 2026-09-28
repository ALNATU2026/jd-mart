import 'package:flutter_test/flutter_test.dart';
import 'package:jdmart/main.dart';

void main() {
  testWidgets('JD Mart app exposes the unified platform dashboard', (
    tester,
  ) async {
    await tester.pumpWidget(const MyApp());
    await tester.pumpAndSettle();

    expect(find.text('JD Mart Platform'), findsOneWidget);
  });
}
